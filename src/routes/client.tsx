import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, FileSignature, CreditCard, Settings, Plus, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";

const nav = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/client/post", label: "Post a Job", icon: PlusCircle },
  { to: "/client/contracts", label: "Active Contracts", icon: FileSignature },
  { to: "/wallet", label: "Payments", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Client Dashboard — DevPay Africa" }] }),
  component: ClientDash,
});

function ClientDash() {
  const { ready, profile } = useRequireAuth("client");
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  return (
    <DashboardShell nav={nav} title="Client Overview">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Welcome, {firstName}</div>
          <div className="font-display text-2xl font-bold mt-1">Build your team, ship faster</div>
        </div>
        <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Post a New Job
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value="5" hint="2 awaiting review" accent="primary" />
        <StatCard label="Total Spent" value="$48,200" hint="Year to date" />
        <StatCard label="Developers Hired" value="14" hint="11 returning" accent="accent" />
        <StatCard label="Open Jobs" value="3" hint="42 proposals" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Active Contracts</h3>
          <div className="space-y-3">
            {[
              { t: "Fintech Dashboard MVP", d: "Kwame Mensah 🇬🇭", s: "In progress", b: "$4,500", p: 60 },
              { t: "Mobile App Backend", d: "Sarah Okonkwo 🇳🇬", s: "Review", b: "$3,200", p: 90 },
              { t: "AI Recommendation Engine", d: "Amina Hassan 🇰🇪", s: "In progress", b: "$8,000", p: 35 },
            ].map((c, i) => (
              <div key={i} className="rounded-lg border border-border/40 p-4 hover:border-primary/40 transition-colors">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-medium">{c.t}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.d}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-semibold">{c.b}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.s}</div>
                  </div>
                </div>
                <div className="mt-3 h-1 rounded-full bg-surface">
                  <div className="h-full rounded-full bg-[image:var(--gradient-primary)]" style={{ width: `${c.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { t: "Post a job", d: "Find your next dev" },
              { t: "Browse developers", d: "Top-rated talent" },
              { t: "Review proposals", d: "12 pending" },
              { t: "Manage payments", d: "$12k in escrow" },
            ].map((a) => (
              <Link key={a.t} to="/jobs" className="block rounded-lg border border-border/40 p-3 hover:border-primary/40 hover:bg-surface/50 transition-all">
                <div className="text-sm font-medium">{a.t}</div>
                <div className="text-xs text-muted-foreground">{a.d}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
