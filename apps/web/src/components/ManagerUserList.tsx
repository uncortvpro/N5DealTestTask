import Link from "next/link";
import { toSlugPath, type PublicUser } from "@n5deal/shared";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusControl } from "@/components/StatusControl";
import { StopClickPropagation } from "@/components/StopClickPropagation";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

const USER_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
];

export function ManagerUserList({
  users,
  detailBase,
}: {
  users: PublicUser[];
  detailBase?: string;
}) {
  if (users.length === 0) {
    return <EmptyState title="No participants match these filters" />;
  }

  return (
    <div className="space-y-3">
      {users.map((u) => {
        const content = (
          <Card
            className={cn(
              detailBase && "transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5"
            )}
          >
            <CardBody className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold text-navy-900",
                      detailBase && "group-hover:underline"
                    )}
                  >
                    {u.name}
                  </span>
                  <StatusBadge status={u.status} />
                </div>
                <p className="text-sm text-navy-500">
                  {u.company ?? "—"} · {u.email}
                </p>
                <p className="text-xs text-navy-400">Joined {formatDate(u.createdAt)}</p>
                {u.status === "SUSPENDED" && u.statusReason && (
                  <p className="mt-1 text-xs text-amber-700">Reason: {u.statusReason}</p>
                )}
              </div>
              <StopClickPropagation>
                <StatusControl
                  apiPath={`/api/manager/users/${u.id}/status`}
                  currentStatus={u.status}
                  statusOptions={USER_STATUS_OPTIONS}
                />
              </StopClickPropagation>
            </CardBody>
          </Card>
        );

        return detailBase ? (
          <Link
            key={u.id}
            href={`${detailBase}/${toSlugPath(u.company ?? u.name, u.id)}`}
            className="group block"
          >
            {content}
          </Link>
        ) : (
          <div key={u.id}>{content}</div>
        );
      })}
    </div>
  );
}
