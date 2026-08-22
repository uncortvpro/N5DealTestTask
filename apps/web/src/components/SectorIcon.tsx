import {
  Cpu,
  Factory,
  HeartPulse,
  Landmark,
  Layers,
  Building2,
  ShoppingBag,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Sector } from "@n5deal/shared";
import { cn } from "@/lib/cn";

// Sector keys are manager-editable now, so this can't cover every possible
// value — known keys get a fitting icon, anything else (including a
// manager-added sector) falls back to a generic one.
const SECTOR_ICON: Partial<Record<Sector, LucideIcon>> = {
  TECHNOLOGY: Cpu,
  HEALTHCARE: HeartPulse,
  MANUFACTURING: Factory,
  FINANCIAL_SERVICES: Landmark,
  REAL_ESTATE: Building2,
  ENERGY: Zap,
  RETAIL: ShoppingBag,
  OTHER: Layers,
};

export function SectorIcon({ sector, className }: { sector: Sector; className?: string }) {
  const Icon = SECTOR_ICON[sector] ?? Layers;
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-950",
        className
      )}
    >
      <Icon size={18} className="text-gold-300" />
    </div>
  );
}
