"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { AssetInput } from "@n5deal/shared";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { AssetForm } from "@/components/AssetForm";

export function EditListingButton({
  assetId,
  defaultValues,
}: {
  assetId: number;
  defaultValues: AssetInput;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil size={13} />
        Edit listing
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit listing" maxWidth="max-w-lg">
        <AssetForm
          mode="edit"
          assetId={assetId}
          defaultValues={defaultValues}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
