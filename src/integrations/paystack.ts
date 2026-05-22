/**
 * Paystack Payment Integration
 * Handles escrow payment processing and verification for job postings
 */

const PAYSTACK_API_BASE = "https://api.paystack.co";
const PAYSTACK_PUBLIC_KEY =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY
    : "";
const PAYSTACK_SECRET_KEY =
  typeof process !== "undefined" ? process.env?.PAYSTACK_SECRET_KEY : "";

if (!PAYSTACK_PUBLIC_KEY) {
  console.warn(
    "[Paystack] VITE_PAYSTACK_PUBLIC_KEY is not configured. Payment functionality will be limited."
  );
}

/**
 * Initialize Paystack payment on the client side
 * Load the Paystack script if not already loaded
 */
export function initializePaystack(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Paystack initialization requires a browser environment"));
      return;
    }

    // Check if Paystack is already loaded
    if ((window as any).PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
}

/**
 * Interface for payment initialization
 */
export interface PaymentOptions {
  email: string;
  amount: number; // Amount in cents (Paystack expects integers in cents)
  reference: string; // Unique reference for the transaction
  metadata?: Record<string, any>; // Optional metadata
  firstName?: string;
  lastName?: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Initiate a Paystack payment modal on the client
 */
export async function initiatePayment(options: PaymentOptions): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Payment initiation requires a browser environment");
  }

  await initializePaystack();

  const { PaystackPop } = window as any;

  // Ensure amount is a valid integer in cents
  const amountInCents = Math.round(options.amount * 100);
  if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
    throw new Error("Invalid amount: must be a positive integer when converted to cents");
  }

  return new Promise((resolve, reject) => {
    try {
      PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: options.email,
        amount: amountInCents,
        ref: options.reference,
        currency: "USD",
        firstname: options.firstName || "",
        lastname: options.lastName || "",
        metadata: options.metadata || {},
        onClose() {
          reject(new Error("Payment cancelled by user"));
        },
        onSuccess(res: any) {
          resolve();
          if (options.onSuccess) {
            options.onSuccess(res.reference);
          }
        },
      });

      PaystackPop.openIframe();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      reject(err);
      if (options.onError) {
        options.onError(err);
      }
    }
  });
}

/**
 * Verify a Paystack payment reference on the server
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<{
  status: string;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      customer_code: string;
      email: string;
      first_name?: string;
      last_name?: string;
    };
  };
}> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error(
      "Paystack secret key is not configured. Cannot verify payment."
    );
  }

  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Paystack] Verification failed:", error);
    throw error;
  }
}

/**
 * Create a Paystack charge for escrow funding
 */
export interface EscrowChargePayload {
  email: string;
  amount: number;
  jobId: string;
  clientId: string;
  description?: string;
  firstName?: string;
  lastName?: string;
}

export async function initiateEscrowPayment(
  payload: EscrowChargePayload
): Promise<string> {
  const reference = `job_${payload.jobId}_${Date.now()}`;

  await initiatePayment({
    email: payload.email,
    amount: payload.amount,
    reference,
    firstName: payload.firstName,
    lastName: payload.lastName,
    metadata: {
      jobId: payload.jobId,
      clientId: payload.clientId,
      type: "job_escrow",
      description: payload.description,
    },
  });

  return reference;
}

/**
 * Format amount for display (e.g., 5000 cents -> $50.00)
 */
export function formatPaystackAmount(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

/**
 * Calculate total amount with escrow service fee (7%)
 */
export function calculateTotalWithFee(baseAmount: number): {
  baseAmount: number;
  serviceFee: number;
  total: number;
} {
  const serviceFee = Math.round(baseAmount * 0.07 * 100) / 100; // 7% fee, rounded to 2 decimals
  const total = Math.round((baseAmount + serviceFee) * 100) / 100; // Total rounded to 2 decimals
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    serviceFee,
    total,
  };
}
