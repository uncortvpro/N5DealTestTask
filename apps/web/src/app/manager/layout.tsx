import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["MANAGER"]);
  return <AppShell user={user}>{children}</AppShell>;
}
