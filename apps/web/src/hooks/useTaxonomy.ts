"use client";

import { useEffect, useState } from "react";
import type { TaxonomyItem } from "@n5deal/shared";
import { apiClient } from "@/lib/apiClient";

interface Taxonomy {
  sectors: TaxonomyItem[];
  regions: TaxonomyItem[];
}

const EMPTY: Taxonomy = { sectors: [], regions: [] };

/** Sector/region are manager-editable rows now, not a fixed enum — client
 * components that need the current active set (dropdown options) fetch it
 * here instead of importing a compile-time list. */
export function useTaxonomy(): Taxonomy {
  const [taxonomy, setTaxonomy] = useState<Taxonomy>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    apiClient<Taxonomy>("/api/public/taxonomy")
      .then((data) => {
        if (!cancelled) setTaxonomy(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return taxonomy;
}
