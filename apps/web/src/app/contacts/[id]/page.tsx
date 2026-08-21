import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toSlugPath } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { Avatar } from "@/components/Avatar";
import { ReplyForm } from "@/components/ReplyForm";
import { MarkReadRefresher } from "@/components/contacts/MarkReadRefresher";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";

interface ThreadMessage {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  fromMe: boolean;
}

interface ThreadDetail {
  id: number;
  assetId: number | null;
  assetTitle: string | null;
  counterpart: { id: number; name: string; company: string | null };
  messages: ThreadMessage[];
}

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const { ok, data } = await apiFetch<{ conversation: ThreadDetail }>(`/api/contacts/${params.id}`);
  if (!ok) notFound();

  const { conversation } = data;
  const counterpartLabel = conversation.counterpart.company ?? conversation.counterpart.name;

  return (
    <>
      <MarkReadRefresher conversationId={conversation.id} />
      <div className="flex items-center gap-3 border-b border-navy-100 px-5 py-3.5">
        <Link href="/contacts" className="text-navy-400 hover:text-navy-900 lg:hidden" aria-label="Back to messages">
          <ArrowLeft size={18} />
        </Link>
        <Avatar name={counterpartLabel} className="h-9 w-9 text-xs" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-navy-950">{counterpartLabel}</h1>
          {conversation.assetTitle && (
            <Link
              href={`/assets/${toSlugPath(conversation.assetTitle, conversation.assetId!)}`}
              className="truncate text-xs text-navy-500 hover:text-navy-800 hover:underline"
            >
              Re: {conversation.assetTitle}
            </Link>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {conversation.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                m.fromMe ? "rounded-br-sm bg-navy-950 text-white" : "rounded-bl-sm bg-navy-50 text-navy-800"
              )}
            >
              <p className="whitespace-pre-line leading-relaxed">{m.body}</p>
              <p className={cn("mt-1 text-[11px]", m.fromMe ? "text-white/55" : "text-navy-400")}>
                {formatDateTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-100 px-5 py-4">
        <ReplyForm conversationId={conversation.id} />
      </div>
    </>
  );
}
