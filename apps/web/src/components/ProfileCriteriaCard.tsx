"use client";

import { useState } from "react";
import { Pencil, Sparkles } from "lucide-react";
import type { BuyerProfile } from "@n5deal/shared";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import { formatCurrency } from "@/lib/format";

export function ProfileCriteriaCard({ profile }: { profile: BuyerProfile | null }) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-navy-950">Investment Criteria</h2>
          <p className="mt-1 text-xs text-navy-400">
            Sellers see this when you contact them, and it drives your match scores.
          </p>
        </div>
        {profile && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil size={13} />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardBody>
        {profile ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Thesis</p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-navy-700">
                {profile.investmentThesis}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-navy-400">Sectors</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.sectorLabels.map((label) => (
                    <Badge key={label} tone="info">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-navy-400">Regions</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.regionLabels.map((label) => (
                    <Badge key={label} tone="neutral">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-navy-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Target deal size</p>
              <p className="mt-0.5 text-lg font-semibold text-navy-950">
                {formatCurrency(profile.ticketSizeMin)} – {formatCurrency(profile.ticketSizeMax)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50">
              <Sparkles size={18} className="text-gold-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-navy-700">No investment profile yet</p>
            <p className="mt-1 max-w-xs text-sm text-navy-400">
              Set your sectors, regions, and deal size to unlock personalized match scores on every
              listing.
            </p>
            <Button variant="gold" className="mt-4" onClick={() => setEditing(true)}>
              Set up profile
            </Button>
          </div>
        )}
      </CardBody>

      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title={profile ? "Edit investment criteria" : "Set up your investment profile"}
        maxWidth="max-w-lg"
      >
        <BuyerProfileForm initialProfile={profile} onSaved={() => setEditing(false)} />
      </Dialog>
    </Card>
  );
}
