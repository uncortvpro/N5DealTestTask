import { CheckCircle2, CircleDashed, Mail } from "lucide-react";
import type { PublicUser } from "@n5deal/shared";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";

const ROLE_LABEL: Record<PublicUser["role"], string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
  MANAGER: "Manager",
};

export function ProfileHeader({
  user,
  profileComplete,
}: {
  user: PublicUser;
  profileComplete: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-950 px-6 py-7 sm:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} variant="inverted" className="h-16 w-16 text-lg ring-4 ring-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {user.name}
              </h1>
              <Badge tone="gold">{ROLE_LABEL[user.role]}</Badge>
            </div>
            <p className="mt-1 text-sm text-navy-300">{user.company ?? "Independent investor"}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-300">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} />
                {user.email}
              </span>
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div
          className={
            profileComplete
              ? "inline-flex items-center gap-2 self-start rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 sm:self-center"
              : "inline-flex items-center gap-2 self-start rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 sm:self-center"
          }
        >
          {profileComplete ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
          {profileComplete ? "Investment profile complete" : "Investment profile incomplete"}
        </div>
      </div>
    </div>
  );
}
