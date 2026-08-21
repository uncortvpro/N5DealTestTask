import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function BuyersLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["SELLER", "MANAGER"]);
  return <AppShell user={user}>{children}</AppShell>;
}
