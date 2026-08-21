"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Field";

export function ContactModal({
  toUserId,
  toName,
  assetId,
  defaultMessage,
  className,
}: {
  toUserId: number;
  toName: string;
  assetId?: number;
  defaultMessage?: string;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function send() {
    if (!message.trim()) {
      setError("Write a short message to get started.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { conversationId } = await apiClient<{ conversationId: number }>("/api/contacts", {
        method: "POST",
        body: JSON.stringify({ toUserId, assetId, message }),
      });
      setOpen(false);
      router.push(`/contacts/${conversationId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="gold" size="lg" onClick={() => setOpen(true)} className={className}>
        <MessageSquare size={16} />
        Contact {toName.split(" ")[0]}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={`Message ${toName}`}>
        <div className="space-y-3">
          <Textarea
            rows={5}
            placeholder="Introduce yourself and explain your interest…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={send} disabled={submitting}>
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
