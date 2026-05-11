import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Star, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Developer Profile — DevPay Africa" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="rounded-2xl border border-border/60 bg-card p-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-hero)" }} />
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-24 w-24 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center font-display font-bold text-3xl text-primary-foreground">A</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-3xl font-bold">Ada Lovelace</h1>
                <span className="text-2xl">🇬🇭</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/30">Verified</span>
              </div>
              <div className="text-muted-foreground mt-1">Senior Full-Stack Engineer · React, Node, AI</div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1 text-accent"><Star className="h-4 w-4 fill-current" /> 4.98 (63 reviews)</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> Accra, Ghana</span>
                <span className="text-primary font-semibold">$65/hr</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground">Hire Me</Button>
              <Button variant="outline"><MessageCircle className="mr-2 h-4 w-4" /> Message</Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-3">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I help startups go from zero to production. 6+ years building scalable web apps for fintech, healthtech, and AI startups across Africa, the US, and Europe. Past clients include Y Combinator companies, public-sector teams, and indie founders.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "AI / LLMs", "Tailwind", "AWS", "Stripe", "GraphQL"].map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20">{s}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { t: "Fintech Trading Dashboard", d: "Real-time market data for 50k+ users" },
                  { t: "Healthtech Mobile App", d: "Telemedicine platform, 4.9★ App Store" },
                  { t: "AI Doc Search", d: "RAG over 10M enterprise docs" },
                  { t: "E-commerce Platform", d: "Multi-vendor marketplace, $2M GMV" },
                ].map((p) => (
                  <a href="#" key={p.t} className="group rounded-lg border border-border/40 overflow-hidden hover:border-primary/40 transition-all">
                    <div className="aspect-video bg-[image:var(--gradient-primary)] opacity-70 group-hover:opacity-100 transition" />
                    <div className="p-3">
                      <div className="font-semibold text-sm">{p.t}</div>
                      <div className="text-xs text-muted-foreground">{p.d}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {[
                  { n: "James Carter 🇺🇸", r: "Ada delivered 2 weeks ahead of schedule. Will hire again immediately." },
                  { n: "Léa Dubois 🇫🇷", r: "Top-tier engineer. Communication and code quality both A+." },
                  { n: "Yuki Tanaka 🇯🇵", r: "Best freelancer I've worked with in 10 years. Worth every cent." },
                ].map((r, i) => (
                  <div key={i} className="border-t border-border/40 pt-4 first:border-0 first:pt-0">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">{r.n}</div>
                      <div className="flex text-accent text-xs">{[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">"{r.r}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-display font-semibold mb-3">Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Jobs completed</span><span className="font-semibold">87</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">On-time</span><span className="text-success">98%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Response time</span><span>{"< 1 hr"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Repeat clients</span><span className="text-primary">62%</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
