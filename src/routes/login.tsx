import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — DevPay Africa" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6"><Logo /></header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Logged in (demo)"); }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your DevPay account</p>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button type="button" variant="outline" className="h-10">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>
              Google
            </Button>
            <Button type="button" variant="outline" className="h-10"><Github className="h-4 w-4 mr-2" />GitHub</Button>
          </div>
          <div className="relative my-5 text-center text-xs text-muted-foreground">
            <span className="bg-card px-3 relative z-10">or with email</span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>
          <div className="space-y-4">
            <div><Label>Email</Label><Input type="email" className="mt-1.5" placeholder="you@email.com" /></div>
            <div><Label>Password</Label><Input type="password" className="mt-1.5" placeholder="••••••••" /></div>
          </div>
          <Button type="submit" className="w-full mt-6 bg-[image:var(--gradient-primary)] text-primary-foreground h-11">Log in</Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
