import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";

const POINTS = [
  "Verified buyers and sellers, not cold outreach",
  "Every listing scored for fit — sector, region, deal size",
  "Direct messaging once a deal looks right",
];

export function AuthBrandPanel({
  eyebrow,
  headline,
}: {
  eyebrow: string;
  headline: string;
}) {
  return (
    <div className="relative hidden overflow-hidden bg-navy-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)" }}
      />

      <Logo on="navy" className="relative" />

      <div className="relative max-w-md">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold-300">
          {eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white">
          {headline}
        </h2>

        <ul className="mt-8 space-y-4">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold-300" />
              <span className="text-sm leading-relaxed text-navy-300">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-navy-300">
        &copy; {new Date().getFullYear()} N5Deal — M&amp;A &amp; Financial Asset Marketplace
      </p>
    </div>
  );
}
