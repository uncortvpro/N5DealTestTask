import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession, roleHome } from "@/lib/session";

export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect(roleHome(user.role));

  return (
    <AuthShell
      brandEyebrow="Welcome back"
      brandHeadline="Pick up your deal flow right where you left off."
      title="Sign in to N5Deal"
      subtitle="Enter your credentials to access your dashboard."
      footer={
        <>
          No account yet?{" "}
          <Link href="/register" className="font-medium text-navy-950 hover:text-gold-600">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
      <div className="mt-6 rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-xs text-navy-500">
        <p className="font-medium text-navy-700">Demo accounts (password: Password123!)</p>
        <p className="mt-1">buyer1@n5deal.com · seller1@n5deal.com · manager1@n5deal.com</p>
      </div>
    </AuthShell>
  );
}
