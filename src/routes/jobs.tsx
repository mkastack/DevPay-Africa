import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Star } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Browse Jobs — DevPay Africa" }] }),
  component: Jobs,
});

const jobs = [
  { id: "1", title: "Senior React Engineer for Fintech Dashboard", budget: "$3,000 – $5,000", time: "2h ago", skills: ["React", "TypeScript", "Tailwind", "PostgreSQL"], rating: 4.9, client: "Acme Capital", remote: "Remote" },
  { id: "2", title: "Mobile App Developer (Flutter)", budget: "$2,500 – $4,000", time: "5h ago", skills: ["Flutter", "Firebase", "Stripe"], rating: 4.7, client: "Pulse Health", remote: "Remote" },
  { id: "3", title: "AI Engineer — Recommendation System", budget: "$6,000 – $10,000", time: "Yesterday", skills: ["Python", "PyTorch", "AWS", "LLM"], rating: 5.0, client: "NeuralGrid", remote: "Remote" },
  { id: "4", title: "Backend Developer — Node + GraphQL", budget: "$2,000 – $3,500", time: "Yesterday", skills: ["Node.js", "GraphQL", "MongoDB"], rating: 4.8, client: "ShopStack", remote: "Remote" },
  { id: "5", title: "DevOps Engineer for Kubernetes Migration", budget: "$4,500 – $7,000", time: "2d ago", skills: ["Kubernetes", "Terraform", "AWS"], rating: 4.6, client: "CloudForge", remote: "Remote" },
  { id: "6", title: "Smart Contract Auditor", budget: "$5,000 – $8,000", time: "3d ago", skills: ["Solidity", "Foundry", "Security"], rating: 4.9, client: "ChainSafe", remote: "Remote" },
];

function Jobs() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold">Find your next <span className="text-gradient-brand">project</span></h1>
          <p className="text-muted-foreground mt-2">Hand-picked jobs from global clients. New listings every hour.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-11 bg-card border-border/60" placeholder="Search jobs, skills, keywords…" />
          </div>
          <select className="h-11 rounded-md border border-border/60 bg-card px-3 text-sm">
            <option>All Categories</option><option>Web Dev</option><option>Mobile</option><option>AI / ML</option><option>DevOps</option>
          </select>
          <select className="h-11 rounded-md border border-border/60 bg-card px-3 text-sm">
            <option>Any Budget</option><option>$1k+</option><option>$3k+</option><option>$5k+</option>
          </select>
          <select className="h-11 rounded-md border border-border/60 bg-card px-3 text-sm">
            <option>Any Timeline</option><option>{"<1 week"}</option><option>1–4 weeks</option><option>1–3 months</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <Link
              key={j.id}
              to="/jobs/$jobId"
              params={{ jobId: j.id }}
              className="group rounded-xl border border-border/60 bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{j.title}</h3>
                <div className="text-primary font-display font-bold whitespace-nowrap">{j.budget}</div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {j.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-surface border border-border/40 text-muted-foreground">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.remote}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{j.time}</span>
                  <span className="flex items-center gap-1 text-accent"><Star className="h-3 w-3 fill-current" />{j.rating}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">Apply →</Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
