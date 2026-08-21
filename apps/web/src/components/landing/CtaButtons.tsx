import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function GoldCtaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-gold-400/30 active:scale-95 sm:w-auto",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <ArrowRight size={16} className="relative transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export function OutlineCtaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md border border-navy-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:border-gold-400/50 active:scale-95 sm:w-auto",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-200 group-hover:bg-white/[0.06]" />
      <span className="relative">{children}</span>
    </Link>
  );
}
