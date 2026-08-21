import type { PublicUser } from "@n5deal/shared";
import { NavBar } from "@/components/NavBar";
import { DashboardFooter } from "@/components/DashboardFooter";
import { apiFetch } from "@/lib/serverFetch";

export async function AppShell({ user, children }: { user: PublicUser; children: React.ReactNode }) {
  const unreadCount =
    user.role === "BUYER" || user.role === "SELLER"
      ? (await apiFetch<{ count: number }>("/api/contacts/unread-count")).data.count
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-navy-50/60">
      <NavBar user={user} unreadCount={unreadCount} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <DashboardFooter />
    </div>
  );
}
