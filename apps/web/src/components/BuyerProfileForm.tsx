"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2 } from "lucide-react";
import { buyerProfileSchema, type BuyerProfile, type BuyerProfileInput } from "@n5deal/shared";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { useTaxonomy } from "@/hooks/useTaxonomy";

export function BuyerProfileForm({
  initialProfile,
  onSaved,
}: {
  initialProfile: BuyerProfile | null;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { sectors, regions } = useTaxonomy();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BuyerProfileInput>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      investmentThesis: initialProfile?.investmentThesis ?? "",
      sectors: initialProfile?.sectors ?? [],
      regions: initialProfile?.regions ?? [],
      ticketSizeMin: initialProfile?.ticketSizeMin ?? 1_000_000,
      ticketSizeMax: initialProfile?.ticketSizeMax ?? 10_000_000,
    },
  });

  async function onSubmit(values: BuyerProfileInput) {
    setServerError(null);
    setSaved(false);
    try {
      await apiClient("/api/buyer/profile", { method: "PUT", body: JSON.stringify(values) });
      setSaved(true);
      router.refresh();
      onSaved?.();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div>
        <Label htmlFor="investmentThesis">Investment thesis</Label>
        <Textarea
          id="investmentThesis"
          rows={4}
          placeholder="What kind of businesses are you looking to acquire, and why?"
          {...register("investmentThesis")}
        />
        <FieldError>{errors.investmentThesis?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ticketSizeMin">Min deal size ($)</Label>
          <Input
            id="ticketSizeMin"
            type="number"
            {...register("ticketSizeMin", { valueAsNumber: true })}
          />
          <FieldError>{errors.ticketSizeMin?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="ticketSizeMax">Max deal size ($)</Label>
          <Input
            id="ticketSizeMax"
            type="number"
            {...register("ticketSizeMax", { valueAsNumber: true })}
          />
          <FieldError>{errors.ticketSizeMax?.message}</FieldError>
        </div>
      </div>

      <div>
        <Label>Sectors of interest</Label>
        <Controller
          name="sectors"
          control={control}
          render={({ field }) => (
            <CheckboxGrid
              options={sectors.map((s) => ({ value: s.key, label: s.label }))}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError>{errors.sectors?.message}</FieldError>
      </div>

      <div>
        <Label>Regions of interest</Label>
        <Controller
          name="regions"
          control={control}
          render={({ field }) => (
            <CheckboxGrid
              options={regions.map((r) => ({ value: r.key, label: r.label }))}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError>{errors.regions?.message}</FieldError>
      </div>

      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="gold" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save profile"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={15} />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}

function CheckboxGrid({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
              checked
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-navy-200 bg-white text-navy-700 hover:border-navy-300 hover:bg-navy-50"
            )}
          >
            {opt.label}
            {checked && <Check size={14} className="shrink-0 text-gold-300" />}
          </button>
        );
      })}
    </div>
  );
}
