"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, X } from "lucide-react";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/cn";

export interface TaxonomyRow {
  id: number;
  key: string;
  label: string;
  active: boolean;
  usageCount: number;
}

export function TaxonomyManager({
  kind,
  title,
  description,
  items,
}: {
  kind: "sectors" | "regions";
  title: string;
  description: string;
  items: TaxonomyRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(row: TaxonomyRow) {
    setError(null);
    try {
      await apiClient(`/api/manager/${kind}/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  async function rename(row: TaxonomyRow, label: string) {
    setError(null);
    try {
      await apiClient(`/api/manager/${kind}/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ label }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      throw err;
    }
  }

  async function create(label: string) {
    setError(null);
    try {
      await apiClient(`/api/manager/${kind === "sectors" ? "sectors" : "regions"}`, {
        method: "POST",
        body: JSON.stringify({ label }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      throw err;
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-navy-950">{title}</h2>
        <p className="mt-1 text-xs text-navy-400">{description}</p>
      </CardHeader>
      <CardBody className="space-y-1">
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <div className="divide-y divide-navy-50">
          {items.map((row) => (
            <TaxonomyRowView key={row.id} row={row} onToggleActive={toggleActive} onRename={rename} />
          ))}
        </div>
        <AddRow onAdd={create} />
      </CardBody>
    </Card>
  );
}

function TaxonomyRowView({
  row,
  onToggleActive,
  onRename,
}: {
  row: TaxonomyRow;
  onToggleActive: (row: TaxonomyRow) => void;
  onRename: (row: TaxonomyRow, label: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(row.label);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!label.trim() || label === row.label) {
      setEditing(false);
      setLabel(row.label);
      return;
    }
    setSaving(true);
    try {
      await onRename(row, label.trim());
      setEditing(false);
    } catch {
      // error surfaced by the parent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      {editing ? (
        <>
          <Input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setEditing(false);
                setLabel(row.label);
              }
            }}
            className="h-9 flex-1"
          />
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50"
            aria-label="Save"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setLabel(row.label);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-navy-400 hover:bg-navy-50"
            aria-label="Cancel"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm font-medium", row.active ? "text-navy-900" : "text-navy-400")}>
              {row.label}
            </p>
            <p className="truncate font-mono text-[11px] text-navy-300">{row.key}</p>
          </div>
          <span className="shrink-0 text-xs text-navy-400">
            {row.usageCount} in use
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            aria-label={`Rename ${row.label}`}
          >
            <Pencil size={14} />
          </button>
          <button type="button" onClick={() => onToggleActive(row)} className="shrink-0">
            <Badge tone={row.active ? "success" : "neutral"} className="cursor-pointer">
              {row.active ? "Active" : "Inactive"}
            </Badge>
          </button>
        </>
      )}
    </div>
  );
}

function AddRow({ onAdd }: { onAdd: (label: string) => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!label.trim()) return;
    setSaving(true);
    try {
      await onAdd(label.trim());
      setLabel("");
      setAdding(false);
    } catch {
      // error surfaced by the parent
    } finally {
      setSaving(false);
    }
  }

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="mt-2 flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
      >
        <Plus size={15} />
        Add new
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <Input
        autoFocus
        placeholder="e.g. Aerospace"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setAdding(false);
        }}
        className="h-9 flex-1"
      />
      <Button size="sm" onClick={submit} disabled={saving}>
        {saving ? "Adding…" : "Add"}
      </Button>
      <Button size="sm" variant="outline" onClick={() => setAdding(false)}>
        Cancel
      </Button>
    </div>
  );
}
