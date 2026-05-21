import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, type Profile, type UserRole } from "./client";
import { useAuthStore } from "@/lib/stores/auth-store";

const OAUTH_ROLE_KEY = "devpay_oauth_role";

type SignUpResult = { needsConfirmation: boolean; email: string };

type AuthCtx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; fullName: string; role: UserRole }) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    let { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    // First sign-in after email confirmation: profile may not exist yet — create from auth metadata.
    if (!data) {
      const { data: u } = await supabase.auth.getUser();
      const meta = (u.user?.user_metadata ?? {}) as { full_name?: string; role?: UserRole; username?: string };
      const localRole = typeof window !== "undefined" ? (localStorage.getItem(OAUTH_ROLE_KEY) as UserRole | null) : null;
      const role = (meta.role as UserRole) ?? localRole ?? "developer";
      const fullName = meta.full_name ?? (u.user?.email?.split("@")[0] ?? "New User");
      const username = meta.username ?? (u.user?.email?.split("@")[0] ?? `user_${userId.slice(0, 6)}`);
      const { data: created } = await supabase.from("profiles").insert({
        id: userId, role, full_name: fullName, username, email: u.user?.email ?? "",
      }).select().maybeSingle();
      if (created) {
        if (role === "developer") await supabase.from("developer_profiles").insert({ user_id: userId });
        else if (role === "client") await supabase.from("client_profiles").insert({ user_id: userId });
        data = created;
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(OAUTH_ROLE_KEY);
      }
    }

    const profileData = (data as Profile) ?? null;
    setProfile(profileData);
    if (profileData) {
      useAuthStore.getState().setUser(profileData);
    } else {
      useAuthStore.getState().logout();
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        loadProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        // Add a 5-second timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 5000);
        loadProfile(s.user.id).finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);


  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp: AuthCtx["signUp"] = async ({ email, password, fullName, role }) => {
    const username = email.split("@")[0] + "_" + Math.random().toString(36).slice(2, 6);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, role, username },
      },
    });
    if (error) throw error;

    const userId = data.user?.id;
    // If session is null, email confirmation is required.
    const needsConfirmation = !data.session;

    // Create profile row when we have a session (RLS allows it). Otherwise it'll be created on first sign-in.
    if (userId && data.session) {
      const { error: pErr } = await supabase.from("profiles").insert({
        id: userId, role, full_name: fullName, username, email,
      });
      if (pErr && !pErr.message.includes("duplicate")) throw pErr;
      if (role === "developer") {
        await supabase.from("developer_profiles").insert({ user_id: userId });
      } else if (role === "client") {
        await supabase.from("client_profiles").insert({ user_id: userId });
      }
    }

    return { needsConfirmation, email };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    useAuthStore.getState().logout();
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user.id);
  };

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, profile, loading, signIn, signUp, signOut, resendConfirmation, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Return a safe noop fallback to avoid runtime crashes when a route
    // renders before the AuthProvider is mounted (client-side transitions).
    return {
      session: null,
      user: null,
      profile: null,
      loading: true,
      signIn: async () => {},
      signUp: async () => ({ needsConfirmation: true, email: "" }),
      signOut: async () => {},
      resendConfirmation: async () => {},
      refreshProfile: async () => {},
    } as AuthCtx;
  }
  return ctx;
}
