import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["BUYER"]);
  return <AppShell user={user}>{children}</AppShell>;
}
