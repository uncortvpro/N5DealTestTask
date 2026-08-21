"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Building2, Lock, Mail, Search, User } from "lucide-react";
import { registerSchema, type PublicUser, type RegisterInput } from "@n5deal/shared";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { FieldError, IconInput, Label } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { roleHome } from "@/lib/roleHome";

const ROLE_OPTIONS = [
  { value: "BUYER" as const, label: "Buyer", description: "Looking to acquire", icon: Search },
  { value: "SELLER" as const, label: "Seller", description: "Looking to sell", icon: Briefcase },
];

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "BUYER" },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    try {
      const { user } = await apiClient<{ user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      router.push(roleHome(user.role));
      router.refresh();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label>I am a…</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const active = field.value === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "flex scale-100 flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-all duration-200 active:scale-95",
                      active
                        ? "border-gold-400 bg-gold-50 shadow-sm ring-1 ring-gold-400/50"
                        : "border-navy-200 bg-white text-navy-700 hover:border-navy-300 hover:bg-navy-50"
                    )}
                  >
                    <opt.icon
                      size={16}
                      className={cn("transition-colors", active ? "text-gold-600" : "text-navy-400")}
                    />
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        active ? "text-navy-950" : "text-navy-800"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className={cn("text-xs", active ? "text-navy-600" : "text-navy-400")}>
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div>
        <Label htmlFor="name">Full name</Label>
        <IconInput id="name" icon={User} placeholder="Jane Cooper" {...register("name")} />
        <FieldError>{errors.name?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="company">Company (optional)</Label>
        <IconInput id="company" icon={Building2} placeholder="Acme Capital" {...register("company")} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <IconInput
          id="email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <IconInput
          id="password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          {...register("password")}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </div>

      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
