import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Briefcase, Wallet as WalletIcon, User, Settings, ArrowDownToLine, Smartphone, CreditCard } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/proposals", label: "My Proposals", icon: FileText },
  { to: "/jobs", label: "Active Jobs", icon: Briefcase },
  { to: "/wallet", label: "Wallet", icon: WalletIcon },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — DevPay Africa" }] }),
  component: WalletPage,
});

const tx = [
  { d: "May 8, 2026", desc: "Stripe SaaS API — milestone 2", a: "+$1,200", s: "Completed" },
  { d: "May 5, 2026", desc: "Withdrawal to MTN MoMo", a: "-$800", s: "Processing" },
  { d: "May 2, 2026", desc: "Fintech dashboard — milestone 1", a: "+$1,500", s: "Completed" },
  { d: "Apr 28, 2026", desc: "Withdrawal to Bank", a: "-$2,000", s: "Completed" },
  { d: "Apr 22, 2026", desc: "Mobile MVP — final", a: "+$3,200", s: "Pending" },
];

const badge: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/30",
  Processing: "bg-accent/10 text-accent border-accent/30",
  Pending: "bg-muted text-muted-foreground border-border",
};

function WalletPage() {
  return (
    <DashboardShell nav={nav} title="Wallet">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Available Balance</div>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="font-display text-5xl font-bold text-gradient-brand">$8,420.50</div>
            <div className="text-muted-foreground">≈ GH₵ 102,330</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground"><ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw</Button>
            <Button variant="outline"><Smartphone className="mr-2 h-4 w-4" /> Mobile Money</Button>
            <Button variant="outline"><CreditCard className="mr-2 h-4 w-4" /> Bank Transfer</Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">In Escrow</div>
          <div className="font-display text-3xl font-bold mt-2 text-accent">$4,200</div>
          <div className="text-xs text-muted-foreground mt-1">Across 3 active projects</div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Lifetime Earnings</div>
            <div className="font-display text-2xl font-bold mt-2">$24,580</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card mt-6 overflow-hidden">
        <div className="p-6 border-b border-border/40">
          <h3 className="font-display text-lg font-semibold">Transaction History</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Description</th><th className="text-right px-6 py-3">Amount</th><th className="text-right px-6 py-3">Status</th></tr>
          </thead>
          <tbody>
            {tx.map((t, i) => (
              <tr key={i} className="border-t border-border/40 hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{t.d}</td>
                <td className="px-6 py-4">{t.desc}</td>
                <td className={`px-6 py-4 text-right font-semibold ${t.a.startsWith("+") ? "text-success" : "text-foreground"}`}>{t.a}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${badge[t.s]}`}>{t.s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
