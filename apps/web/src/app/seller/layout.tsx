import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["SELLER"]);
  return <AppShell user={user}>{children}</AppShell>;
}
