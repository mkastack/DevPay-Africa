import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nmjqzgnunvvrqllwutal.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Qszi-BRivaGnYMAx0H10Sg_CGli3f6i";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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
