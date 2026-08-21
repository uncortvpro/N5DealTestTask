"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

export function LandingHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-20 transition-all duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "border-b border-navy-800 bg-navy-950/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo on="navy" />

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#roles" className="group relative text-sm font-medium text-navy-200 transition-colors hover:text-white">
            How it works
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-200 group-hover:w-full" />
          </a>
          <a href="#matching" className="group relative text-sm font-medium text-navy-200 transition-colors hover:text-white">
            Smart matching
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-200 group-hover:w-full" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-navy-200 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group relative inline-flex items-center overflow-hidden rounded-md bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-950 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-gold-400/25 active:scale-95"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative">Get Started</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
