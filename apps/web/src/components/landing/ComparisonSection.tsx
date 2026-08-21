import { Check, X } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { GoldCtaLink } from "@/components/landing/CtaButtons";

const OLD_WAY = [
  "Cold emails and unsolicited calls",
  "Deal data scattered across spreadsheets and PDFs",
  "No way to tell if a buyer or seller is even a fit",
  "Weeks spent qualifying before you can negotiate",
];

const NEW_WAY = [
  "A transparent fit score before you ever reach out",
  "One dashboard for every listing and conversation",
  "Buyers and sellers matched by sector, region, and deal size",
  "Message directly once you already know it's worth your time",
];

export function ComparisonSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            Skip the cold outreach
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-500">
            Deal-making used to mean spreadsheets and guesswork. N5Deal replaces it with structure.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-navy-100 bg-navy-50/60 p-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                The old way
              </p>
              <ul className="mt-5 space-y-4">
                {OLD_WAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-navy-500">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200/70">
                      <X size={12} className="text-navy-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative h-full overflow-hidden rounded-xl border border-gold-300 bg-navy-950 p-7 shadow-xl shadow-gold-400/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)" }}
              />
              <p className="relative text-xs font-semibold uppercase tracking-wide text-gold-300">
                With N5Deal
              </p>
              <ul className="relative mt-5 space-y-4">
                {NEW_WAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-navy-100">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/20">
                      <Check size={12} className="text-gold-300" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="relative mt-7">
                <GoldCtaLink href="/register" className="w-full sm:w-full">
                  Get started free
                </GoldCtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
