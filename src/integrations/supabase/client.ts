import { createClient } from "@supabase/supabase-js";

// Read from Vite env vars (set in .env as VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://nmjqzgnunvvrqllwutal.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_Qszi-BRivaGnYMAx0H10Sg_CGli3f6i";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
    "Add them to your .env file."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export type UserRole = "developer" | "client" | "admin";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_active: boolean;
};
