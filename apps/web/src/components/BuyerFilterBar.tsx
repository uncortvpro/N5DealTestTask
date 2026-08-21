"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SECTOR_LABELS, SECTORS, REGION_LABELS, REGIONS } from "@n5deal/shared";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { KeywordFilterField } from "@/components/KeywordFilterField";

const SECTOR_OPTIONS = [
  { value: "", label: "All sectors" },
  ...SECTORS.map((s) => ({ value: s, label: SECTOR_LABELS[s] })),
];

const REGION_OPTIONS = [
  { value: "", label: "All regions" },
  ...REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] })),
];

export function BuyerFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
        <SlidersHorizontal size={13} />
        Filters
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <KeywordFilterField
          placeholder="Name, company, or thesis…"
          initialValue={searchParams.get("keyword") ?? ""}
          onSearch={(v) => updateParam("keyword", v)}
          pending={isPending}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Sector interest</label>
          <Dropdown
            className="w-44"
            options={SECTOR_OPTIONS}
            value={searchParams.get("sector") ?? ""}
            onChange={(v) => updateParam("sector", v)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Region interest</label>
          <Dropdown
            className="w-40"
            options={REGION_OPTIONS}
            value={searchParams.get("region") ?? ""}
            onChange={(v) => updateParam("region", v)}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => router.push(pathname)}>
          Clear
        </Button>
      </div>
    </div>
  );
}
