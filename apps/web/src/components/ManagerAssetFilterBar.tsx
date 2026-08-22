"use client";

import { SlidersHorizontal } from "lucide-react";
import { SECTOR_LABELS, SECTORS, REGION_LABELS, REGIONS } from "@n5deal/shared";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { KeywordFilterField } from "@/components/KeywordFilterField";
import { useFilterParams } from "@/hooks/useFilterParams";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REMOVED", label: "Removed" },
];

const SECTOR_OPTIONS = [
  { value: "", label: "All sectors" },
  ...SECTORS.map((s) => ({ value: s, label: SECTOR_LABELS[s] })),
];

const REGION_OPTIONS = [
  { value: "", label: "All regions" },
  ...REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] })),
];

export function ManagerAssetFilterBar() {
  const { searchParams, isPending, updateParam, clear } = useFilterParams();

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
        <SlidersHorizontal size={13} />
        Filters
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <KeywordFilterField
          className="min-w-[200px]"
          placeholder="Title or description…"
          initialValue={searchParams.get("keyword") ?? ""}
          onSearch={(v) => updateParam("keyword", v)}
          pending={isPending}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Status</label>
          <Dropdown
            className="w-36"
            options={STATUS_OPTIONS}
            value={searchParams.get("status") ?? ""}
            onChange={(v) => updateParam("status", v)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Sector</label>
          <Dropdown
            className="w-44"
            options={SECTOR_OPTIONS}
            value={searchParams.get("sector") ?? ""}
            onChange={(v) => updateParam("sector", v)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Region</label>
          <Dropdown
            className="w-40"
            options={REGION_OPTIONS}
            value={searchParams.get("region") ?? ""}
            onChange={(v) => updateParam("region", v)}
          />
        </div>
        <Button type="button" variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
