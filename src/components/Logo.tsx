import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] flex items-center justify-center font-display font-bold text-primary-foreground">
        D
      </div>
      <span className="font-display font-bold text-lg tracking-tight">
        DevPay <span className="text-primary">Africa</span>
      </span>
    </Link>
  );
}
