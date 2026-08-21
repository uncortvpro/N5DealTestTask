import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";

export interface ConversationSummary {
  id: number;
  assetId: number | null;
  assetTitle: string | null;
  counterpart: { id: number; name: string; company: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export function ConversationListPane({
  conversations,
  activeId,
}: {
  conversations: ConversationSummary[];
  activeId: number | null;
}) {
  return (
    <>
      <div className="border-b border-navy-100 px-5 py-4">
        <h1 className="text-base font-semibold tracking-tight text-navy-950">Messages</h1>
        <p className="mt-0.5 text-xs text-navy-400">
          {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No conversations yet"
              description="Reach out from a listing to start one."
            />
          </div>
        ) : (
          conversations.map((c) => {
            const active = c.id === activeId;
            const unread = c.unreadCount > 0;
            const label = c.counterpart.company ?? c.counterpart.name;
            return (
              <Link
                key={c.id}
                href={`/contacts/${c.id}`}
                className={cn(
                  "flex items-center gap-3 border-b border-navy-50 px-4 py-3 transition-colors last:border-0",
                  active ? "bg-navy-50" : "hover:bg-navy-50/60"
                )}
              >
                <Avatar name={label} className="h-9 w-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "truncate text-sm text-navy-950",
                        unread ? "font-semibold" : "font-medium"
                      )}
                    >
                      {label}
                    </p>
                    <span className="shrink-0 text-[11px] text-navy-400">
                      {formatDateTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "truncate text-xs",
                        unread ? "font-medium text-navy-800" : "text-navy-500"
                      )}
                    >
                      {c.lastMessage}
                    </p>
                    {unread && (
                      <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {c.unreadCount > 9 ? "9+" : c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
