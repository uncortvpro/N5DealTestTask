import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  default: "bg-navy-950 text-gold-300",
  // For placing on a navy-950 surface (e.g. dark banners) — the default
  // variant is invisible there since its fill matches the background.
  inverted: "bg-gold-400 text-navy-950",
};

export function Avatar({
  name,
  variant = "default",
  className,
}: {
  name: string;
  variant?: keyof typeof VARIANT_CLASSES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
