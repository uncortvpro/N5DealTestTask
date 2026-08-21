import { cn } from "@/lib/cn";

interface Props {
  name: string;
  totalListings: number;
  topMatches: number;
  sectors: number;
}

export function BuyerWelcomeBanner({ name, totalListings, topMatches, sectors }: Props) {
  const firstName = name.split(" ")[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-950 px-6 py-7 sm:px-8">
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

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            Here&apos;s what&apos;s live across the marketplace right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
          <Stat label="Listings" value={totalListings} />
          <Stat label="Top matches" value={topMatches} accent />
          <Stat label="Sectors" value={sectors} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p className={cn("text-2xl font-semibold", accent ? "text-gold-300" : "text-white")}>{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-300">{label}</p>
    </div>
  );
}
