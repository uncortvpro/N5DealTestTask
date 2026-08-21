import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { Logo } from "@/components/Logo";

export function AuthShell({
  brandEyebrow,
  brandHeadline,
  title,
  subtitle,
  footer,
  children,
}: {
  brandEyebrow: string;
  brandHeadline: string;
  title: string;
  subtitle: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel eyebrow={brandEyebrow} headline={brandHeadline} />

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />

          <h1 className="text-2xl font-semibold tracking-tight text-navy-950">{title}</h1>
          <p className="mt-2 text-sm text-navy-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-navy-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}
