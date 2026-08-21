"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Opening a conversation marks its messages read as a side effect of the
 * page's own server-side fetch — but the conversation *list* lives in the
 * parent layout, which Next.js does not re-fetch on sibling navigation.
 * This nudges the whole route tree to refresh once so the list's unread
 * badges catch up with what just happened.
 */
export function MarkReadRefresher({ conversationId }: { conversationId: number }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return null;
}
