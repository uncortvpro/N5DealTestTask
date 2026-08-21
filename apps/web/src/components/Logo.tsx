import Link from "next/link";
import { cn } from "@/lib/cn";

const SIZE_CLASSES = {
  sm: { mark: "h-7 w-7", glyph: "text-sm", text: "text-sm" },
  md: { mark: "h-8 w-8", glyph: "text-base", text: "text-base" },
} as const;

export function Logo({
  on = "white",
  size = "md",
  withText = true,
  textClassName,
  className,
}: {
  /** Background the logo sits on — determines mark/text contrast. */
  on?: "navy" | "white";
  size?: keyof typeof SIZE_CLASSES;
  withText?: boolean;
  /** Extra classes for the wordmark, e.g. "hidden sm:inline" to hide it on small screens. */
  textClassName?: string;
  className?: string;
}) {
  const s = SIZE_CLASSES[size];
  const onNavy = on === "navy";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md font-bold leading-none tracking-tight",
          s.mark,
          s.glyph,
          onNavy ? "bg-gold-400 text-navy-950" : "bg-navy-950 text-gold-300"
        )}
      >
        N
      </div>
      {withText && (
        <span
          className={cn("font-semibold", s.text, onNavy ? "text-white" : "text-navy-950", textClassName)}
        >
          N5Deal
        </span>
      )}
    </Link>
  );
}
