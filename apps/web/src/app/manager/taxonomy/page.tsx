import { apiFetch } from "@/lib/serverFetch";
import { TaxonomyManager, type TaxonomyRow } from "@/components/TaxonomyManager";

export default async function ManagerTaxonomyPage() {
  const { data } = await apiFetch<{ sectors: TaxonomyRow[]; regions: TaxonomyRow[] }>(
    "/api/manager/taxonomy"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Sectors &amp; Regions</h1>
        <p className="mt-1 text-sm text-navy-500">
          The taxonomy buyers and sellers pick from everywhere else on the platform. Renaming is
          safe — every listing and profile that already points to an entry keeps working.
          Deactivating hides it from new selections without touching what already references it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TaxonomyManager
          kind="sectors"
          title="Sectors"
          description="Industry categories listings and investment profiles are tagged with."
          items={data.sectors}
        />
        <TaxonomyManager
          kind="regions"
          title="Regions"
          description="Geographic categories listings and investment profiles are tagged with."
          items={data.regions}
        />
      </div>
    </div>
  );
}
