"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ConversationListPane, type ConversationSummary } from "@/components/contacts/ConversationListPane";

// No websocket in this prototype, so the inbox stays fresh by polling —
// re-running the route's server fetches on an interval instead of pushing
// updates. Skipped while the tab is hidden so it doesn't burn requests
// in a background tab.
const POLL_INTERVAL_MS = 5000;

export function ContactsShell({
  conversations,
  children,
}: {
  conversations: ConversationSummary[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = pathname.startsWith("/contacts/") ? Number(pathname.split("/")[2]) : null;
  const hasSelection = activeId !== null;

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="grid h-[calc(100vh-260px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
      <div
        className={cn(
          "flex min-h-0 flex-col border-navy-100 lg:border-r",
          hasSelection && "hidden lg:flex"
        )}
      >
        <ConversationListPane conversations={conversations} activeId={activeId} />
      </div>

      <div className={cn("flex min-h-0 flex-col", !hasSelection && "hidden lg:flex")}>{children}</div>
    </div>
  );
}
