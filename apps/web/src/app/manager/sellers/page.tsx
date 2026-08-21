import type { PublicUser } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { ManagerFilterBar } from "@/components/ManagerFilterBar";
import { ManagerUserList } from "@/components/ManagerUserList";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default async function ManagerSellersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams({
    role: "SELLER",
    ...Object.fromEntries(Object.entries(searchParams).filter(([, v]) => Boolean(v))),
  } as Record<string, string>);

  const { data } = await apiFetch<{ users: PublicUser[] }>(`/api/manager/users?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Sellers</h1>
        <p className="mt-1 text-sm text-navy-500">All registered sellers on the platform.</p>
      </div>
      <ManagerFilterBar statusOptions={STATUS_OPTIONS} />
      <ManagerUserList users={data.users} detailBase="/sellers" />
    </div>
  );
}
