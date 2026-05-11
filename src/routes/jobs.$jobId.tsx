import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ShieldCheck, Clock, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job Details — DevPay Africa" }] }),
  component: JobDetail,
});

function JobDetail() {
  const { jobId } = Route.useParams();
  const [pitch, setPitch] = useState("");
  const [generated, setGenerated] = useState("");
  const [generating, setGenerating] = useState(false);
  const [escrowOpen, setEscrowOpen] = useState(false);

  const handleGenerate = () => {
    if (!pitch.trim()) return toast.error("Add a few pitch points first");
    setGenerating(true);
    setTimeout(() => {
      setGenerated(
        `Hi there,\n\nI've delivered 30+ projects matching this exact stack and would love to bring that experience to your team.\n\n${pitch}\n\nMy approach: I'd start with a 2-day discovery to align on scope, ship the MVP within 3 weeks in weekly milestones, and provide 30 days of post-launch support.\n\nAvailable to start Monday. Let's build something great together.\n\n— Ada`
      );
      setGenerating(false);
    }, 900);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">← Back to jobs</Link>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-8">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Job #{jobId}</span> • <span>Posted 2h ago</span> • <span className="text-success">42 active</span>
              </div>
              <h1 className="font-display text-3xl font-bold mt-3">Senior React Engineer for Fintech Dashboard</h1>
              <div className="flex flex-wrap gap-4 mt-5 text-sm">
                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> $3,000 – $5,000</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> 4–6 weeks</div>
                <div className="flex items-center gap-2 text-success"><ShieldCheck className="h-4 w-4" /> Payment verified</div>
              </div>
              <div className="mt-6 prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed">
                <p>We're building a next-generation fintech dashboard for institutional traders. Looking for a senior engineer to own the front-end architecture, design system, and core data-grid experience.</p>
                <h3 className="font-display text-foreground text-base mt-5 mb-2">What you'll do</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Architect and ship the React + TypeScript dashboard</li>
                  <li>Build a high-performance virtualized data grid (50k+ rows)</li>
                  <li>Integrate real-time WebSocket pricing feeds</li>
                  <li>Collaborate with our designer on a polished UI system</li>
                </ul>
                <h3 className="font-display text-foreground text-base mt-5 mb-2">Required skills</h3>
                <div className="flex flex-wrap gap-1.5 not-prose">
                  {["React", "TypeScript", "Tailwind", "PostgreSQL", "WebSockets", "Vite"].map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-surface border border-border/40 text-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Submit your proposal</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 w-full sm:w-auto">
                    <Sparkles className="mr-2 h-4 w-4" /> AI Proposal Writer
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display">AI Proposal Writer</DialogTitle>
                    <DialogDescription>Drop a few key pitch points. Claude will craft a winning proposal.</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="• Built 3 fintech dashboards for YC startups&#10;• 5 years React + TS experience&#10;• Available 40 hrs/week"
                    rows={5}
                  />
                  {generated && (
                    <div className="mt-2 p-4 rounded-lg bg-surface border border-primary/20 text-sm whitespace-pre-wrap max-h-60 overflow-auto">{generated}</div>
                  )}
                  <DialogFooter>
                    <Button onClick={handleGenerate} disabled={generating} className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                      {generating ? "Generating…" : <><Sparkles className="mr-2 h-4 w-4" /> Generate Proposal</>}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Textarea className="mt-4" rows={6} placeholder="Or write your proposal here…" defaultValue={generated} key={generated} />
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => setEscrowOpen(true)} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> How escrow works
                </button>
                <Button onClick={() => toast.success("Proposal sent! 🎉")} className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                  Submit Proposal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">About the client</div>
              <div className="flex items-center gap-3 mt-3">
                <div className="h-12 w-12 rounded-full bg-[image:var(--gradient-accent)] flex items-center justify-center font-display font-bold">A</div>
                <div>
                  <div className="font-semibold">Acme Capital 🇺🇸</div>
                  <div className="text-xs text-accent">★ 4.9 · 28 jobs posted</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span>2023</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hire rate</span><span>92%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total spent</span><span className="text-primary">$184k</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div className="font-display font-semibold mt-2">Escrow protected</div>
              <p className="text-xs text-muted-foreground mt-1">Funds held safely. Released only when work is approved.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Escrow modal */}
      <Dialog open={escrowOpen} onOpenChange={setEscrowOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">How Escrow Works</DialogTitle>
            <DialogDescription>Safe for both sides. Always.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {[
              { t: "Client funds the project", d: "Money moves into a secure DevPay escrow wallet." },
              { t: "Escrow holds the funds", d: "Neither party can touch funds until conditions are met." },
              { t: "Developer ships the work", d: "Submit milestones for client review." },
              { t: "Funds released to dev", d: "Approved work pays out instantly to your wallet." },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">{s.t}<CheckCircle2 className="h-4 w-4 text-success" /></div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
