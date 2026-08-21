import { Logo } from "@/components/Logo";

export function DashboardFooter() {
  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-navy-400 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" withText={false} />
          <span>&copy; {new Date().getFullYear()} N5Deal — M&amp;A &amp; Financial Asset Marketplace</span>
        </div>
        <p>All figures shown are illustrative demo data.</p>
      </div>
    </footer>
  );
}
