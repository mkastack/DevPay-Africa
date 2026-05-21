import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader2, LayoutDashboard, FileText, Briefcase, CreditCard, User, Settings } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuthStore } from "@/lib/stores/auth-store";

export const developerNav = [
  { to: "/developer", label: "Overview", icon: LayoutDashboard },
  { to: "/developer/proposals", label: "My Proposals", icon: FileText },
  { to: "/developer/active-jobs", label: "Active Jobs", icon: Briefcase },
  { to: "/wallet", label: "Wallet", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/profile", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/developer")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (user?.role !== "developer") {
      throw redirect({ to: "/client" });
    }
  },
  head: () => ({ meta: [{ title: "Developer Dashboard — DevPay Africa" }] }),
  component: DeveloperLayout,
});

function DeveloperLayout() {
  return (
    <DashboardShell nav={developerNav} title="Developer Workspace">
      <Outlet />
    </DashboardShell>
  );
}
