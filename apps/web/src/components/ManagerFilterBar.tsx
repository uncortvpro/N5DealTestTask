"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { KeywordFilterField } from "@/components/KeywordFilterField";
import { useFilterParams } from "@/hooks/useFilterParams";

export function ManagerFilterBar({
  statusOptions,
}: {
  statusOptions: { value: string; label: string }[];
}) {
  const { searchParams, isPending, updateParam, clear } = useFilterParams();

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
        <SlidersHorizontal size={13} />
        Filters
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <KeywordFilterField
          placeholder="Search by name, email, company…"
          initialValue={searchParams.get("keyword") ?? ""}
          onSearch={(v) => updateParam("keyword", v)}
          pending={isPending}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-500">Status</label>
          <Dropdown
            className="w-40"
            options={[{ value: "", label: "All statuses" }, ...statusOptions]}
            value={searchParams.get("status") ?? ""}
            onChange={(v) => updateParam("status", v)}
          />
        </div>
        <Button type="button" variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
