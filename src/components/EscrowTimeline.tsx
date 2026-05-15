import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, CheckCircle2, AlertTriangle, Send, FileUp, Loader2, Clock } from "lucide-react";

type Event = {
  id: string;
  kind: "funded" | "submitted" | "approved" | "released" | "dispute" | "deliverable";
  title: string;
  detail?: string;
  amount?: number;
  at: string;
};

const meta: Record<Event["kind"], { icon: typeof ShieldCheck; color: string; ring: string }> = {
  funded:      { icon: ShieldCheck,   color: "text-primary",     ring: "bg-primary/10 border-primary/30" },
  submitted:   { icon: Send,          color: "text-warning",     ring: "bg-warning/10 border-warning/30" },
  approved:    { icon: CheckCircle2,  color: "text-success",     ring: "bg-success/10 border-success/30" },
  released:    { icon: CheckCircle2,  color: "text-success",     ring: "bg-success/10 border-success/30" },
  dispute:     { icon: AlertTriangle, color: "text-destructive", ring: "bg-destructive/10 border-destructive/30" },
  deliverable: { icon: FileUp,        color: "text-accent",      ring: "bg-accent/10 border-accent/30" },
};

export function EscrowTimeline({ jobId }: { jobId: string }) {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: ms }, { data: dels }, { data: disp }] = await Promise.all([
        supabase.from("milestones").select("id,title,amount,status,submitted_at,approved_at,created_at").eq("job_id", jobId),
        supabase.from("milestone_deliverables").select("id,file_name,notes,created_at,milestone_id,milestones!inner(job_id)").eq("milestones.job_id", jobId),
        supabase.from("disputes").select("id,reason,description,status,created_at").eq("job_id", jobId),
      ]);
      if (cancelled) return;

      const list: Event[] = [];
      (ms ?? []).forEach((m: any) => {
        list.push({ id: `f-${m.id}`, kind: "funded", title: `Escrow funded — ${m.title}`, amount: Number(m.amount), at: m.created_at });
        if (m.submitted_at) list.push({ id: `s-${m.id}`, kind: "submitted", title: `Milestone submitted — ${m.title}`, amount: Number(m.amount), at: m.submitted_at });
        if (m.approved_at) {
          list.push({ id: `a-${m.id}`, kind: "approved", title: `Milestone approved — ${m.title}`, amount: Number(m.amount), at: m.approved_at });
          if (m.status === "released") list.push({ id: `r-${m.id}`, kind: "released", title: `Funds released — ${m.title}`, amount: Number(m.amount), at: m.approved_at });
        }
      });
      (dels ?? []).forEach((d: any) =>
        list.push({ id: `d-${d.id}`, kind: "deliverable", title: `Deliverable uploaded`, detail: d.file_name, at: d.created_at })
      );
      (disp ?? []).forEach((d: any) =>
        list.push({ id: `x-${d.id}`, kind: "dispute", title: `Dispute ${d.status} — ${d.reason}`, detail: d.description, at: d.created_at })
      );

      list.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setEvents(list);
    })();
    return () => { cancelled = true; };
  }, [jobId]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Escrow Activity
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Milestone payments, approvals, and disputes — newest first.</p>
        </div>
      </div>
      {events === null ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : events.length === 0 ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2 py-4">
          <Clock className="h-4 w-4" /> No escrow events yet for this project.
        </div>
      ) : (
        <ol className="relative pl-5">
          <span className="absolute left-2 top-1 bottom-1 w-px bg-border/60" />
          {events.map((e) => {
            const m = meta[e.kind];
            const Icon = m.icon;
            return (
              <li key={e.id} className="relative pb-5 last:pb-0">
                <span className={`absolute -left-3.5 top-0.5 h-6 w-6 rounded-full border flex items-center justify-center ${m.ring}`}>
                  <Icon className={`h-3 w-3 ${m.color}`} />
                </span>
                <div className="ml-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{e.title}</span>
                    {e.amount != null && <span className={`text-xs font-semibold ${m.color}`}>${e.amount.toFixed(2)}</span>}
                  </div>
                  {e.detail && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{e.detail}</div>}
                  <div className="text-[11px] text-muted-foreground mt-1">{new Date(e.at).toLocaleString()}</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
