import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/integrations/supabase/auth-context";

export function SiteHeader() {
  const { session, profile } = useAuth();
  const dashHref = profile?.role === "client" ? "/client" : "/dashboard";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="/#compare" className="hover:text-foreground transition-colors">Compare</a>
          <Link to="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link>
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <Button asChild size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
              <Link to={dashHref}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
