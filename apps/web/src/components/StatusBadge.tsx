import { Badge } from "@/components/ui/Badge";

const TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  REMOVED: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={TONE[status] ?? "neutral"} className="capitalize">
      {status.toLowerCase()}
    </Badge>
  );
}
