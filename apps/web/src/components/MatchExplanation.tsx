"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

/** Lazily fetched so the asset page itself never waits on an LLM round
 * trip — loads after the deterministic score is already on screen. Fails
 * silently (renders nothing) if explanations aren't configured or the
 * call errors, since this is additive color on top of a score that
 * already stands on its own. */
export function MatchExplanation({ assetId }: { assetId: number }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    apiClient<{ explanation: string }>(`/api/assets/${assetId}/match-explanation`)
      .then((data) => {
        if (!cancelled) setText(data.explanation);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [assetId]);

  if (failed) return null;

  return (
    <div className="flex items-start gap-2.5 border-t border-navy-100 px-5 py-4">
      <Sparkles size={15} className="mt-0.5 shrink-0 text-gold-500" />
      {loading ? (
        <div className="flex-1 space-y-1.5 py-0.5">
          <div className="h-3 w-full animate-pulse rounded bg-navy-50" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-navy-50" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-navy-700">{text}</p>
      )}
    </div>
  );
}
