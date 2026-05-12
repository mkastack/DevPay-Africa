import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Loader2, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/integrations/supabase/auth-context";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Browse Jobs — DevPay Africa" }] }),
  component: Jobs,
});

type JobRow = {
  id: string;
  title: string;
  description: string | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string | null;
  duration: string | null;
  status: string;
  created_at: string;
  client_id: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Jobs() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setJobs((data as JobRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = jobs.filter((j) => !q || j.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-bold">Find your next <span className="text-gradient-brand">project</span></h1>
            <p className="text-muted-foreground mt-2">Live jobs from global clients.</p>
          </div>
          {profile?.role === "client" && (
            <Button asChild className="bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Link to="/client">Post a job</Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-11 bg-card border-border/60" placeholder="Search jobs, skills, keywords…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-12 text-center">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="font-display text-xl font-semibold mt-4">No open jobs yet</div>
            <p className="text-sm text-muted-foreground mt-2">
              {profile?.role === "client" ? "Be the first to post a job." : "Check back soon — new listings every hour."}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {filtered.map((j) => (
              <Link
                key={j.id}
                to="/jobs/$jobId"
                params={{ jobId: j.id }}
                className="group rounded-xl border border-border/60 bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{j.title}</h3>
                  <div className="text-primary font-display font-bold whitespace-nowrap">
                    {j.budget_min ? `$${j.budget_min.toLocaleString()}` : "—"}{j.budget_max ? ` – $${j.budget_max.toLocaleString()}` : ""}
                  </div>
                </div>
                {j.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{j.description}</p>}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Remote</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(j.created_at)}</span>
                  </div>
                  <span className="text-primary">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
