"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { IconInput } from "@/components/ui/Field";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { cn } from "@/lib/cn";

export function KeywordFilterField({
  label = "Keyword",
  placeholder,
  initialValue,
  onSearch,
  pending,
  className,
  delay = 2000,
}: {
  label?: string;
  placeholder: string;
  initialValue: string;
  onSearch: (value: string) => void;
  /** External pending state (e.g. a router transition) to also show the spinner for. */
  pending?: boolean;
  className?: string;
  delay?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [debouncing, setDebouncing] = useState(false);
  const debounced = useDebouncedCallback((v: string) => {
    setDebouncing(false);
    onSearch(v);
  }, delay);

  function handleChange(next: string) {
    setValue(next);
    setDebouncing(true);
    debounced.trigger(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDebouncing(false);
    debounced.flush(value);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("min-w-[220px] flex-1", className)}>
      <label className="mb-1 block text-xs font-medium text-navy-500">{label}</label>
      <div className="relative">
        <IconInput
          icon={Search}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        {(debouncing || pending) && (
          <Loader2
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-navy-300"
          />
        )}
      </div>
    </form>
  );
}
