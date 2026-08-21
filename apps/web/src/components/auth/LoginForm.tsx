"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { loginSchema, type LoginInput, type PublicUser } from "@n5deal/shared";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { FieldError, IconInput, Label } from "@/components/ui/Field";
import { roleHome } from "@/lib/roleHome";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    try {
      const { user } = await apiClient<{ user: PublicUser }>("/api/auth/login", {
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
          placeholder="••••••••"
          {...register("password")}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </div>
      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
