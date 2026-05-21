import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({ meta: [{ title: "Redirecting — DevPay Africa" }] }),
  component: DashboardDispatcher,
});

function DashboardDispatcher() {
  const { user: profile, isLoading: loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (profile) {
      if (profile.role === "developer") {
        navigate({ to: "/developer" });
      } else {
        navigate({ to: "/client" });
      }
    }
  }, [profile, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Entering your workspace…</p>
      </div>
    </div>
  );
}
