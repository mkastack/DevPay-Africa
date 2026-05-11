import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Briefcase, Wallet, User, Settings, ArrowRight, Star, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/proposals", label: "My Proposals", icon: FileText },
  { to: "/jobs", label: "Active Jobs", icon: Briefcase },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Developer Dashboard — DevPay Africa" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { ready, profile } = useRequireAuth("developer");
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  return (
    <DashboardShell nav={nav} title="Overview">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Welcome back, {firstName} 👋</div>
          <div className="font-display text-2xl font-bold mt-1">Here's what's happening today</div>
        </div>
        <Button asChild className="bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Link to="/jobs">Browse Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Earned" value="$24,580" hint="+12% this month" accent="primary" />
        <StatCard label="Active Projects" value="7" hint="3 in review" />
        <StatCard label="Pending Proposals" value="12" hint="4 viewed" />
        <StatCard label="Rating" value="4.98 ★" hint="63 reviews" accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
            <button className="text-xs text-primary">View all</button>
          </div>
          <div className="space-y-1">
            {[
              { t: "Payment received", d: "$1,200 from Stripe SaaS API project", time: "2h ago", c: "bg-success" },
              { t: "Proposal accepted", d: "Fintech dashboard build for Acme Inc.", time: "5h ago", c: "bg-primary" },
              { t: "Milestone approved", d: "Mobile App MVP — Phase 1", time: "Yesterday", c: "bg-accent" },
              { t: "New message", d: "James Carter sent you a file", time: "Yesterday", c: "bg-primary" },
              { t: "Review received", d: "5★ from Fatima Ali", time: "2 days ago", c: "bg-accent" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-t border-border/40 first:border-0">
                <div className={`h-2 w-2 rounded-full ${a.c}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.d}</div>
                </div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">This Week</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span>Proposal win rate</span><span className="text-primary font-semibold">68%</span></div>
              <div className="h-1.5 rounded-full bg-surface"><div className="h-full rounded-full bg-[image:var(--gradient-primary)]" style={{ width: "68%" }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span>On-time delivery</span><span className="text-accent font-semibold">94%</span></div>
              <div className="h-1.5 rounded-full bg-surface"><div className="h-full rounded-full bg-[image:var(--gradient-accent)]" style={{ width: "94%" }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span>Client satisfaction</span><span className="font-semibold">98%</span></div>
              <div className="h-1.5 rounded-full bg-surface"><div className="h-full rounded-full bg-success" style={{ width: "98%" }} /></div>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-surface border border-border/40">
            <div className="flex items-center gap-2 text-accent text-xs font-medium"><Star className="h-3.5 w-3.5 fill-current" /> Top 5% this week</div>
            <div className="text-sm mt-1">You're crushing it. Keep going!</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
