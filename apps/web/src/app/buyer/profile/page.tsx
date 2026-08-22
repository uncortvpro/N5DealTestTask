import { redirect } from "next/navigation";
import type { Asset, AssetWithScore, BuyerProfile } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileCriteriaCard } from "@/components/ProfileCriteriaCard";
import { MatchSnapshotCard } from "@/components/MatchSnapshotCard";
import { RecentConversationsCard } from "@/components/RecentConversationsCard";

interface MatchResponse {
  assets: AssetWithScore[];
  hasProfile: boolean;
}

interface ConversationSummary {
  id: number;
  assetTitle: string | null;
  counterpart: { id: number; name: string; company: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export default async function BuyerProfilePage() {
  const [user, profileResult, matchResult, contactsResult, favoritesResult] = await Promise.all([
    getSession(),
    apiFetch<{ profile: BuyerProfile | null }>("/api/buyer/profile"),
    apiFetch<MatchResponse>("/api/match/assets"),
    apiFetch<{ conversations: ConversationSummary[] }>("/api/contacts"),
    apiFetch<{ assets: Asset[] }>("/api/favorites"),
  ]);

  if (!user) redirect("/login");

  const profile = profileResult.ok ? profileResult.data.profile : null;
  const conversations = contactsResult.ok ? contactsResult.data.conversations : [];
  const match = matchResult.ok ? matchResult.data : { hasProfile: false, assets: [] };
  const savedCount = favoritesResult.ok ? favoritesResult.data.assets.length : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ProfileHeader user={user} profileComplete={Boolean(profile)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCriteriaCard profile={profile} />
          <RecentConversationsCard conversations={conversations} />
        </div>

        <div className="space-y-6">
          <MatchSnapshotCard
            hasProfile={match.hasProfile}
            assets={match.assets}
            savedCount={savedCount}
          />
        </div>
      </div>
    </div>
  );
}
