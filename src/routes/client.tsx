import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2, LayoutDashboard, Users, Briefcase, CreditCard, Banknote, Settings } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";

export const clientNav = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/client/talent", label: "Find Talent", icon: Users },
  { to: "/client/post-job", label: "Post a Job", icon: Briefcase },
  { to: "/wallet", label: "Payments", icon: CreditCard },
  { to: "/client/payouts", label: "Payouts", icon: Banknote },
  { to: "/profile", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Hirer Dashboard — DevPay Africa" }] }),
  component: ClientLayout,
});

function ClientLayout() {
  const { ready } = useRequireAuth();
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <DashboardShell nav={clientNav} title="Hirer Workspace">
      <Outlet />
    </DashboardShell>
  );
}
