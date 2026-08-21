"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assetInputSchema,
  REGIONS,
  REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  toSlugPath,
  type AssetInput,
} from "@n5deal/shared";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Field";

const SECTOR_OPTIONS = SECTORS.map((s) => ({ value: s, label: SECTOR_LABELS[s] }));
const REGION_OPTIONS = REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] }));

export function AssetForm({
  mode = "create",
  assetId,
  defaultValues,
  onSuccess,
}: {
  mode?: "create" | "edit";
  assetId?: number;
  defaultValues?: AssetInput;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AssetInput>({ resolver: zodResolver(assetInputSchema), defaultValues });

  async function onSubmit(values: AssetInput) {
    setServerError(null);
    try {
      if (mode === "edit" && assetId) {
        await apiClient(`/api/assets/${assetId}`, { method: "PATCH", body: JSON.stringify(values) });
        router.push(`/assets/${toSlugPath(values.title, assetId)}`);
        router.refresh();
        onSuccess?.();
      } else {
        const { asset } = await apiClient<{ asset: { id: number } }>("/api/assets", {
          method: "POST",
          body: JSON.stringify(values),
        });
        router.push(`/assets/${toSlugPath(values.title, asset.id)}`);
        router.refresh();
      }
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. B2B SaaS Analytics Platform" {...register("title")} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Business overview, financial highlights, why it's for sale…"
          {...register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={SECTOR_OPTIONS}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Select a sector"
              />
            )}
          />
          <FieldError>{errors.sector?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={REGION_OPTIONS}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Select a region"
              />
            )}
          />
          <FieldError>{errors.region?.message}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="dealSize">Deal size ($)</Label>
          <Input id="dealSize" type="number" {...register("dealSize", { valueAsNumber: true })} />
          <FieldError>{errors.dealSize?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="revenue">Revenue ($, optional)</Label>
          <Input
            id="revenue"
            type="number"
            {...register("revenue", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
          />
        </div>
        <div>
          <Label htmlFor="ebitda">EBITDA ($, optional)</Label>
          <Input
            id="ebitda"
            type="number"
            {...register("ebitda", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
          />
        </div>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" variant="gold" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "edit"
            ? "Saving…"
            : "Publishing…"
          : mode === "edit"
            ? "Save changes"
            : "Publish listing"}
      </Button>
    </form>
  );
}
