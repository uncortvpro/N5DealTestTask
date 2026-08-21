import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function DarkPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-navy-950 px-6 py-7 sm:px-8", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
