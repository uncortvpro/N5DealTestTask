import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AssetForm } from "@/components/AssetForm";

export default function NewAssetPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Publish a Listing</h1>
        <p className="mt-1 text-sm text-navy-500">
          Buyers will see this listing ranked by fit against their investment profile.
        </p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-navy-900">Listing details</h2>
        </CardHeader>
        <CardBody>
          <AssetForm />
        </CardBody>
      </Card>
    </div>
  );
}
