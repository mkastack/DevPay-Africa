import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2, LayoutDashboard, Briefcase, CreditCard, ShieldCheck, Settings } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";

export const clientNav = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/client/post-job", label: "Post a Job", icon: Briefcase },
  { to: "/client/active-contracts", label: "Active Contracts", icon: ShieldCheck },
  { to: "/wallet", label: "Payments", icon: CreditCard },
  { to: "/profile", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Hirer Dashboard — DevPay Africa" }] }),
  component: ClientLayout,
});

function ClientLayout() {
  const { ready } = useRequireAuth("client");
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
