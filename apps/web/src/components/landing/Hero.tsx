import { ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { GoldCtaLink, OutlineCtaLink } from "@/components/landing/CtaButtons";

interface Stats {
  buyers: number;
  sellers: number;
  activeAssets: number;
  sectors: number;
}

export function Hero({ stats }: { stats: Stats | null }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-24 pt-32 sm:pb-32 sm:pt-40">
      {/* dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* soft glow, slowly breathing */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)",
          animation: "glow-pulse 7s ease-in-out infinite",
        }}
      />

      {/* floating listing chips — decorative, hidden on smaller screens */}
      <div
        className="pointer-events-none absolute left-[6%] top-32 hidden lg:block"
        style={{ animation: "float-slow 6s ease-in-out infinite", ["--float-rotate" as string]: "-4deg" }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-navy-700 bg-navy-900/80 px-4 py-3 shadow-xl backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">B2B SaaS Platform</p>
            <p className="text-[11px] text-navy-400">$4.5M · 92% match</p>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-24 right-[8%] hidden lg:block"
        style={{
          animation: "float-slow 7s ease-in-out infinite",
          animationDelay: "1.2s",
          ["--float-rotate" as string]: "3deg",
        }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-navy-700 bg-navy-900/80 px-4 py-3 shadow-xl backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">New buyer match</p>
            <p className="text-[11px] text-navy-400">Kim Family Office</p>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute right-[16%] top-20 hidden xl:block"
        style={{
          animation: "float-slow 6.5s ease-in-out infinite",
          animationDelay: "0.6s",
          ["--float-rotate" as string]: "-3deg",
        }}
      >
        <div className="flex items-center gap-2.5 rounded-full border border-navy-700 bg-navy-900/80 px-3.5 py-2 shadow-xl backdrop-blur">
          <ShieldCheck size={14} className="text-gold-300" />
          <p className="text-[11px] font-medium text-white">Verified account</p>
        </div>
      </div>

      <div
        className="relative mx-auto max-w-4xl px-6 text-center"
        style={{ animation: "hero-fade-up 700ms ease-out" }}
      >
        <span className="inline-flex items-center rounded-full border border-navy-700 bg-navy-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-300">
          M&amp;A &amp; Financial Asset Marketplace
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Structured deal flow for{" "}
          <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
            serious buyers and sellers.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-navy-300 sm:text-lg">
          N5Deal connects vetted buyers with acquisition-ready businesses and financial assets —
          with transparent fit scoring instead of cold outreach and fragmented spreadsheets.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GoldCtaLink href="/register">Get Started</GoldCtaLink>
          <OutlineCtaLink href="/login">Sign in</OutlineCtaLink>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-navy-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-gold-400" />
            Verified accounts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={13} className="text-gold-400" />
            Instant match scoring
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={13} className="text-gold-400" />
            No broker fees
          </span>
        </div>

        {stats && (
          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-6 border-t border-navy-800 pt-10 sm:grid-cols-4">
            <Stat label="Active listings" value={stats.activeAssets} />
            <Stat label="Buyers" value={stats.buyers} />
            <Stat label="Sellers" value={stats.sellers} />
            <Stat label="Sectors covered" value={stats.sectors} />
          </dl>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-2xl font-semibold text-white sm:text-3xl">
        <AnimatedCounter value={value} />
      </dt>
      <dd className="mt-1 text-xs uppercase tracking-wide text-navy-300">{label}</dd>
    </div>
  );
}
