import { SECTORS, SECTOR_LABELS } from "@n5deal/shared";
import { Reveal } from "@/components/landing/Reveal";

export function SectorStrip() {
  return (
    <section className="border-y border-navy-100 bg-white py-14">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
            Deals across every sector
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {SECTORS.map((s) => (
              <span
                key={s}
                className="rounded-full border border-navy-100 bg-navy-50 px-4 py-1.5 text-sm font-medium text-navy-700 transition-all duration-150 hover:-translate-y-0.5 hover:border-gold-200 hover:bg-gold-50 hover:text-gold-800 hover:shadow-sm"
              >
                {SECTOR_LABELS[s]}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
