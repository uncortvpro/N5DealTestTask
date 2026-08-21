import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function SellersLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["BUYER", "MANAGER"]);
  return <AppShell user={user}>{children}</AppShell>;
}
