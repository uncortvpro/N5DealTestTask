import {
  type ComponentType,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-md border border-navy-200 bg-white text-sm text-navy-900 placeholder:text-navy-300 transition-shadow focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 disabled:bg-navy-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, "h-11 px-3.5", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "resize-y px-3.5 py-2.5", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "h-11 px-3.5", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ size?: number | string; className?: string }>;
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon: Icon, ...props }, ref) => (
    <div className="relative">
      <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
      <input ref={ref} className={cn(fieldBase, "h-11 pl-10 pr-3.5", className)} {...props} />
    </div>
  )
);
IconInput.displayName = "IconInput";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-navy-800", className)} {...props} />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}
