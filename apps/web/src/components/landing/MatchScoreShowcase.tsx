import { Reveal } from "@/components/landing/Reveal";

const BREAKDOWN = [
  { label: "Sector fit", detail: "Technology matches your profile", value: 40, max: 40 },
  { label: "Region fit", detail: "North America matches your profile", value: 25, max: 25 },
  { label: "Deal size fit", detail: "$4.5M sits inside your $3–9M range", value: 27, max: 35 },
];

export function MatchScoreShowcase() {
  const total = BREAKDOWN.reduce((sum, b) => sum + b.value, 0);

  return (
    <section id="matching" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Smart Matching
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            Every listing comes with a fit score, not a guess.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-500">
            Our matching engine weighs sector alignment, geographic fit, and deal-size range to
            score every asset against a buyer&apos;s investment profile in real time — transparently,
            with no black box.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-navy-700">
            <li>
              <span className="font-semibold text-navy-950">For buyers — </span>
              spend time on the listings that actually fit, ranked automatically.
            </li>
            <li>
              <span className="font-semibold text-navy-950">For sellers — </span>
              see which buyers are worth reaching out to, before you send a message.
            </li>
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-xl shadow-navy-900/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-navy-900/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
                  Sample listing
                </p>
                <h3 className="mt-1 text-base font-semibold text-navy-950">
                  B2B SaaS Analytics Platform
                </h3>
              </div>
              <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {total}% match
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {BREAKDOWN.map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-navy-700">{b.label}</span>
                    <span className="text-navy-400">{b.detail}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-50">
                    <div
                      className="h-full rounded-full bg-gold-400 transition-[width] duration-1000 ease-out"
                      style={{ width: `${(b.value / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
