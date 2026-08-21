import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession, roleHome } from "@/lib/session";

export default async function RegisterPage() {
  const user = await getSession();
  if (user) redirect(roleHome(user.role));

  return (
    <AuthShell
      brandEyebrow="Join the marketplace"
      brandHeadline="Create your profile once. Let the right deals find you."
      title="Create your account"
      subtitle="Platform Manager accounts are provisioned separately."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-navy-950 hover:text-gold-600">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
