import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, PlusCircle, FileSignature, CreditCard, Settings, Plus, Loader2, User } from "lucide-react";
import { useRequireAuth } from "@/integrations/supabase/use-require-auth";
import { useAuth } from "@/integrations/supabase/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nav = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/jobs", label: "Browse Jobs", icon: PlusCircle },
  { to: "/wallet", label: "Payments", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Client Dashboard — DevPay Africa" }] }),
  component: ClientDash,
});

type JobRow = { id: string; title: string; status: string; budget_min: number | null; budget_max: number | null; created_at: string };

function ClientDash() {
  const { ready, profile } = useRequireAuth("client");
  const { session } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [counts, setCounts] = useState({ open: 0, proposals: 0 });

  // post-a-job dialog
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", budget_min: "", budget_max: "", duration: "" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from("jobs").select("*").eq("client_id", session.user.id)
      .order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => {
        const rows = (data as JobRow[]) ?? [];
        setJobs(rows);
        setCounts((c) => ({ ...c, open: rows.filter((r) => r.status === "open").length }));
      });
    // proposal count for owner's jobs
    supabase.from("jobs").select("id").eq("client_id", session.user.id).then(async ({ data }) => {
      const ids = (data ?? []).map((r: { id: string }) => r.id);
      if (!ids.length) return;
      const { count } = await supabase.from("proposals").select("*", { count: "exact", head: true }).in("job_id", ids);
      setCounts((c) => ({ ...c, proposals: count ?? 0 }));
    });
  }, [session?.user]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setPosting(true);
    const { data, error } = await supabase.from("jobs").insert({
      client_id: session.user.id,
      title: form.title,
      description: form.description,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      duration: form.duration || null,
      status: "open",
    }).select().single();
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Job posted!");
    setOpen(false);
    setForm({ title: "", description: "", budget_min: "", budget_max: "", duration: "" });
    if (data) navigate({ to: "/jobs/$jobId", params: { jobId: (data as JobRow).id } });
  };

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <DashboardShell nav={nav} title="Client Overview">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Welcome, {firstName}</div>
          <div className="font-display text-2xl font-bold mt-1">Build your team, ship faster</div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Post a New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Post a new job</DialogTitle>
              <DialogDescription>Get proposals from top African developers within hours.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePost} className="space-y-4">
              <div><Label>Title</Label><Input required className="mt-1.5" placeholder="Senior React Engineer for fintech dashboard" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea required rows={5} className="mt-1.5" placeholder="What you're building, scope, success criteria…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Min budget (USD)</Label><Input type="number" min="0" className="mt-1.5" placeholder="2000" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} /></div>
                <div><Label>Max budget (USD)</Label><Input type="number" min="0" className="mt-1.5" placeholder="5000" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} /></div>
              </div>
              <div><Label>Duration</Label><Input className="mt-1.5" placeholder="4–6 weeks" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
              <DialogFooter>
                <Button type="submit" disabled={posting} className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                  {posting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Posting…</> : "Post job"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Jobs" value={counts.open.toString()} hint="Accepting proposals" accent="primary" />
        <StatCard label="Total Posted" value={jobs.length.toString()} />
        <StatCard label="Proposals Received" value={counts.proposals.toString()} hint="Across all jobs" accent="accent" />
        <StatCard label="Active Projects" value="0" hint="Hire to get started" />
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mt-6">
        <h3 className="font-display text-lg font-semibold mb-4">Your jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs yet. Post your first to get matched with talent.</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((j) => (
              <Link key={j.id} to="/jobs/$jobId" params={{ jobId: j.id }} className="block rounded-lg border border-border/40 p-4 hover:border-primary/40 transition-colors">
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
    </DashboardShell>
  );
}
