import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-navy-800 text-white hover:bg-navy-700 disabled:bg-navy-300",
  secondary: "bg-navy-50 text-navy-800 hover:bg-navy-100 disabled:text-navy-300",
  outline: "border border-navy-200 text-navy-800 hover:bg-navy-50 disabled:text-navy-300",
  ghost: "text-navy-700 hover:bg-navy-50 disabled:text-navy-300",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-200",
  gold: "bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:bg-gold-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  // Matches the h-11 height of Input/Select/Dropdown so a Button placed
  // inline next to a form field (e.g. a "Clear" button in a filter bar)
  // lines up exactly instead of sitting 1px short.
  md: "h-11 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 hover:enabled:scale-[1.02] active:enabled:scale-95 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
