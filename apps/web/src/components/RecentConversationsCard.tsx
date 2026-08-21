import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { formatDateTime } from "@/lib/format";

interface ConversationSummary {
  id: number;
  assetTitle: string | null;
  counterpart: { id: number; name: string; company: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export function RecentConversationsCard({ conversations }: { conversations: ConversationSummary[] }) {
  const recent = conversations.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-navy-950">Recent Conversations</h2>
        {conversations.length > 0 && (
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-900"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        )}
      </CardHeader>
      <CardBody>
        {recent.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            description="Reach out to a seller from a listing to start one."
          />
        ) : (
          <div className="space-y-1">
            {recent.map((c) => (
              <Link
                key={c.id}
                href={`/contacts/${c.id}`}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-navy-50"
              >
                <Avatar name={c.counterpart.company ?? c.counterpart.name} className="h-9 w-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <p
                    className={
                      c.unreadCount > 0
                        ? "truncate text-sm font-semibold text-navy-950"
                        : "truncate text-sm font-medium text-navy-950"
                    }
                  >
                    {c.counterpart.company ?? c.counterpart.name}
                  </p>
                  <p className="truncate text-xs text-navy-500">{c.lastMessage}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[11px] text-navy-400">{formatDateTime(c.lastMessageAt)}</span>
                  {c.unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                      {c.unreadCount > 9 ? "9+" : c.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
