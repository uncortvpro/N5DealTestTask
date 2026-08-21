"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  assetId,
  initialFavorited,
  size = "md",
}: {
  assetId: number;
  initialFavorited: boolean;
  size?: "sm" | "md";
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const previous = favorited;
    setFavorited(!previous);
    try {
      const { favorited: confirmed } = await apiClient<{ favorited: boolean }>(
        `/api/favorites/${assetId}`,
        { method: "POST" }
      );
      setFavorited(confirmed);
    } catch {
      setFavorited(previous);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from saved listings" : "Save this listing"}
      title={favorited ? "Remove from saved listings" : "Save this listing"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-navy-300 transition-colors hover:bg-navy-50 hover:text-navy-500 disabled:opacity-60",
        size === "md" ? "h-10 w-10" : "h-8 w-8"
      )}
    >
      <Star
        size={size === "md" ? 20 : 16}
        className={favorited ? "fill-gold-400 text-gold-500" : ""}
      />
    </button>
  );
}
