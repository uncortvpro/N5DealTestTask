"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-navy-200 bg-white px-3.5 text-sm text-navy-900 transition-colors hover:border-navy-300 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30",
          open && "border-gold-400 ring-2 ring-gold-400/30"
        )}
      >
        <span className={cn("truncate", !selected && "text-navy-300")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          className={cn("shrink-0 text-navy-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 max-h-64 w-full min-w-max overflow-auto rounded-lg border border-navy-100 bg-white p-1 shadow-lg shadow-navy-900/10">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                type="button"
                key={opt.value || "__all__"}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  active ? "bg-navy-950 text-white" : "text-navy-700 hover:bg-navy-50"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check size={14} className="shrink-0 text-gold-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
