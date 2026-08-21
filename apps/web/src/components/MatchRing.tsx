import { cn } from "@/lib/cn";

const TIER = [
  { min: 85, stroke: "#d3a24a", text: "text-gold-600", track: "#f5ebd2" },
  { min: 70, stroke: "#10b981", text: "text-emerald-600", track: "#d1fae5" },
  { min: 40, stroke: "#f59e0b", text: "text-amber-600", track: "#fef3c7" },
  { min: 0, stroke: "#94a3b8", text: "text-navy-500", track: "#e6ecf4" },
] as const;

export function MatchRing({ score, size = 48 }: { score: number | null | undefined; size?: number }) {
  if (score === null || score === undefined) return null;

  const tier = TIER.find((t) => score >= t.min)!;
  const strokeWidth = size <= 40 ? 3.5 : 4.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={`${score}% match`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke={tier.track} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={tier.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-bold leading-none", tier.text)} style={{ fontSize: size * 0.26 }}>
          {score}
        </span>
      </div>
    </div>
  );
}
