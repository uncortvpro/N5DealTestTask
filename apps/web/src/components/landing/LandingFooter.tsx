import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingFooter() {
  return (
    <footer className="bg-navy-950 pb-10 pt-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-navy-800 px-6 pt-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo on="navy" size="sm" withText={false} />
          <span className="text-sm font-medium text-navy-300">
            &copy; {new Date().getFullYear()} N5Deal
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-navy-300">
          <Link href="/login" className="hover:text-white">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-white">
            Create account
          </Link>
        </div>
      </div>
    </footer>
  );
}
