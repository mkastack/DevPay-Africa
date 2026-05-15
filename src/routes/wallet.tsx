import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, FileText, Briefcase, Wallet as WalletIcon, User, Settings, ArrowDownToLine, Smartphone, CreditCard, Loader2, ShieldCheck, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";
import { useAuth } from "@/integrations/supabase/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nav = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/wallet", label: "Wallet", icon: WalletIcon },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — DevPay Africa" }] }),
  component: WalletPage,
});

type Tx = {
  id: string;
  user_id: string;
  amount: number;
  currency: string | null;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
};

type Wd = { id: string; amount: number; method: string; destination: string | null; status: string; created_at: string };

const badge: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/30",
  processing: "bg-accent/10 text-accent border-accent/30",
  pending: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
};

function WalletPage() {
  const { ready } = useRequireAuth();
  const { session } = useAuth();
  const [tx, setTx] = useState<Tx[]>([]);
  const [wd, setWd] = useState<Wd[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // withdraw form
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"momo" | "bank">("momo");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    if (!session?.user) return;
    setLoadingData(true);
    const [{ data: txs }, { data: wds }] = await Promise.all([
      supabase.from("transactions").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("withdrawals").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(50),
    ]);
    setTx((txs as Tx[]) ?? []);
    setWd((wds as Wd[]) ?? []);
    setLoadingData(false);
  };

  useEffect(() => { refresh(); }, [session?.user]);

  const balance = tx.reduce((sum, t) => {
    if (t.status !== "completed") return sum;
    const sign = ["payment", "release", "deposit", "credit"].includes(t.type) ? 1 : -1;
    return sum + sign * Number(t.amount);
  }, 0)
    - wd.filter((w) => ["pending", "processing", "completed"].includes(w.status))
        .reduce((s, w) => s + Number(w.amount), 0);

  // Payment status breakdown
  const inEscrow = tx.filter((t) => t.type === "escrow" && t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
  const pendingApproval = tx.filter((t) => (t.type === "milestone" || t.type === "delivery") && t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
  const releasedPayouts = tx.filter((t) => (t.type === "release" || t.type === "payout") && t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  const lifetime = tx.filter((t) => t.status === "completed" && ["payment", "release", "deposit", "credit"].includes(t.type)).reduce((s, t) => s + Number(t.amount), 0);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error("Enter an amount"); return; }
    if (amt > balance) { toast.error("Amount exceeds available balance"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: session.user.id,
      amount: amt,
      method,
      destination: destination || null,
      status: "pending",
      currency: "USD",
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Withdrawal requested");
    setOpen(false);
    setAmount(""); setDestination("");
    refresh();
  };

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <DashboardShell nav={nav} title="Wallet">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Available Balance</div>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="font-display text-5xl font-bold text-gradient-brand">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground" disabled={balance <= 0}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Withdraw funds</DialogTitle>
                  <DialogDescription>Request a payout. Available: ${balance.toFixed(2)}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div><Label>Amount (USD)</Label><Input required type="number" min="1" step="0.01" max={balance} className="mt-1.5" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
                  <div>
                    <Label>Method</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <button type="button" onClick={() => setMethod("momo")} className={`rounded-md border p-3 text-sm flex items-center gap-2 transition-colors ${method === "momo" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
                        <Smartphone className="h-4 w-4" /> Mobile Money
                      </button>
                      <button type="button" onClick={() => setMethod("bank")} className={`rounded-md border p-3 text-sm flex items-center gap-2 transition-colors ${method === "bank" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
                        <CreditCard className="h-4 w-4" /> Bank
                      </button>
                    </div>
                  </div>
                  <div><Label>{method === "momo" ? "Phone number" : "Account / IBAN"}</Label><Input required className="mt-1.5" placeholder={method === "momo" ? "+233 24 000 0000" : "GB29 NWBK..."} value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting} className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting…</> : "Request payout"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Payment Status</div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-accent" /> In Escrow</div>
              <div className="font-semibold text-accent">${inEscrow.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-warning" /> Pending Approval</div>
              <div className="font-semibold text-warning">${pendingApproval.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-success" /> Released Payouts</div>
              <div className="font-semibold text-success">${releasedPayouts.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Lifetime</div>
            <div className="font-display text-xl font-bold">${lifetime.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Withdrawals */}
      <div className="rounded-2xl border border-border/60 bg-card mt-6 overflow-hidden">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Withdrawals</h3>
          <span className="text-xs text-muted-foreground">{wd.length} total</span>
        </div>
        {loadingData ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : wd.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No withdrawals yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Method</th><th className="text-right px-6 py-3">Amount</th><th className="text-right px-6 py-3">Status</th></tr>
            </thead>
            <tbody>
              {wd.map((w) => (
                <tr key={w.id} className="border-t border-border/40">
                  <td className="px-6 py-4 text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{w.method}{w.destination ? ` · ${w.destination}` : ""}</td>
                  <td className="px-6 py-4 text-right font-semibold">-${Number(w.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right"><span className={`text-xs px-2.5 py-1 rounded-full border ${badge[w.status] ?? badge.pending}`}>{w.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-border/60 bg-card mt-6 overflow-hidden">
        <div className="p-6 border-b border-border/40">
          <h3 className="font-display text-lg font-semibold">Transaction History</h3>
        </div>
        {loadingData ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : tx.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No transactions yet. Once you start earning or paying, they'll show up here.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Description</th><th className="text-right px-6 py-3">Amount</th><th className="text-right px-6 py-3">Status</th></tr>
            </thead>
            <tbody>
              {tx.map((t) => {
                const positive = ["payment", "release", "deposit", "credit"].includes(t.type);
                return (
                  <tr key={t.id} className="border-t border-border/40 hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{t.description ?? t.type}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${positive ? "text-success" : "text-foreground"}`}>{positive ? "+" : "-"}${Number(t.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right"><span className={`text-xs px-2.5 py-1 rounded-full border ${badge[t.status] ?? badge.pending}`}>{t.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
