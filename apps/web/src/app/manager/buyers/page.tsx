import type { PublicUser } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { ManagerFilterBar } from "@/components/ManagerFilterBar";
import { ManagerUserList } from "@/components/ManagerUserList";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default async function ManagerBuyersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams({
    role: "BUYER",
    ...Object.fromEntries(Object.entries(searchParams).filter(([, v]) => Boolean(v))),
  } as Record<string, string>);

  const { data } = await apiFetch<{ users: PublicUser[] }>(`/api/manager/users?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Buyers</h1>
        <p className="mt-1 text-sm text-navy-500">All registered buyers on the platform.</p>
      </div>
      <ManagerFilterBar statusOptions={STATUS_OPTIONS} />
      <ManagerUserList users={data.users} detailBase="/buyers" />
    </div>
  );
}
