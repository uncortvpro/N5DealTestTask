"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";

export function ReplyForm({ conversationId }: { conversationId: number }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient(`/api/contacts/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <Textarea
        rows={2}
        placeholder="Write a reply… (Enter to send, Shift+Enter for a new line)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" variant="gold" disabled={submitting}>
          {submitting ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
