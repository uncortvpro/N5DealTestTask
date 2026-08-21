import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";
import { apiFetch } from "@/lib/serverFetch";
import { ContactsShell } from "@/components/contacts/ContactsShell";
import type { ConversationSummary } from "@/components/contacts/ConversationListPane";

export default async function ContactsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["BUYER", "SELLER"]);
  const { data } = await apiFetch<{ conversations: ConversationSummary[] }>("/api/contacts");

  return (
    <AppShell user={user}>
      <ContactsShell conversations={data.conversations}>{children}</ContactsShell>
    </AppShell>
  );
}
