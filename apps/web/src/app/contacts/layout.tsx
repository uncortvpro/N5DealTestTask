import { AppShell } from "@/components/AppShell";
import { requireSession } from "@/lib/session";
import { apiFetch } from "@/lib/serverFetch";
import { ContactsShell } from "@/components/contacts/ContactsShell";
import type { ConversationSummary } from "@/components/contacts/ConversationListPane";

export default async function ContactsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession(["BUYER", "SELLER"]);
  const result = await apiFetch<{ conversations: ConversationSummary[] }>("/api/contacts");
  const conversations = result.ok ? result.data.conversations : [];

  return (
    <AppShell user={user}>
      <ContactsShell conversations={conversations}>{children}</ContactsShell>
    </AppShell>
  );
}
