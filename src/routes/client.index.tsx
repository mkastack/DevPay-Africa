import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/integrations/supabase/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/client/")({
  head: () => ({ meta: [{ title: "Hirer Overview — DevPay Africa" }] }),
  component: ClientOverview,
});

type JobRow = { id: string; title: string; status: string; budget_min: number | null; budget_max: number | null; created_at: string };

function ClientOverview() {
  const { profile, session } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [counts, setCounts] = useState({ open: 0, proposals: 0, escrow: 0 });

  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      const { data } = await supabase.from("jobs").select("*").eq("client_id", session.user.id)
        .order("created_at", { ascending: false }).limit(8);
      const rows = (data as JobRow[]) ?? [];
      setJobs(rows);
      const ids = rows.map((r) => r.id);
      let pCount = 0, escrow = 0;
      if (ids.length) {
        const { count } = await supabase.from("proposals").select("*", { count: "exact", head: true }).in("job_id", ids);
        pCount = count ?? 0;
        const { data: ms } = await supabase.from("milestones").select("amount,status").in("job_id", ids);
        escrow = (ms ?? []).filter((m: { status: string }) => ["pending", "in_progress", "submitted"].includes(m.status))
          .reduce((s: number, m: { amount: number }) => s + Number(m.amount), 0);
      }
      setCounts({ open: rows.filter((r) => r.status === "open").length, proposals: pCount, escrow });
    })();
  }, [session?.user]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Welcome, {firstName}</div>
          <div className="font-display text-2xl font-bold mt-1">Build your team, ship faster</div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/client/talent"><Users className="mr-2 h-4 w-4" /> Find Talent</Link>
          </Button>
          <Button asChild className="bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Link to="/client/post-job"><Plus className="mr-2 h-4 w-4" /> Post a Job</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Jobs" value={counts.open.toString()} hint="Accepting proposals" accent="primary" />
        <StatCard label="Total Posted" value={jobs.length.toString()} />
        <StatCard label="Proposals Received" value={counts.proposals.toString()} accent="accent" />
        <StatCard label="In Escrow" value={`$${counts.escrow.toLocaleString()}`} hint="Funds protected" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Your projects</h3>
            <Link to="/client/post-job" className="text-xs text-primary hover:underline flex items-center gap-1">New <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No projects yet. Post your first to get matched with vetted African talent.</p>
              <Button asChild className="mt-4 bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Link to="/client/post-job">Post a Job</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((j) => (
                <Link key={j.id} to="/client/projects/$jobId" params={{ jobId: j.id }} className="block rounded-lg border border-border/40 p-4 hover:border-primary/40 hover:bg-surface/40 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{new Date(j.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-semibold">{j.budget_min ? `$${j.budget_min}` : "—"}{j.budget_max ? ` – $${j.budget_max}` : ""}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{j.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h3 className="font-display text-lg font-semibold mt-3">Escrow Protection</h3>
          <p className="text-sm text-muted-foreground mt-2">Funds are held by DevPay Africa until you approve each milestone. Disputes mediated within 48 hours.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-surface/60 p-3"><div className="text-muted-foreground">Service fee</div><div className="font-display text-lg font-bold">7%</div></div>
            <div className="rounded-lg bg-surface/60 p-3"><div className="text-muted-foreground">Coverage</div><div className="font-display text-lg font-bold">100%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
