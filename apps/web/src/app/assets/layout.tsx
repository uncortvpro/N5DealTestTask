import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export default async function AssetsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();
  return <AppShell user={user}>{children}</AppShell>;
}
