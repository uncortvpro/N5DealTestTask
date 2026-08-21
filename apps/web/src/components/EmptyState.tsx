import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50">
        <Inbox size={18} className="text-navy-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-navy-700">{title}</p>
      {description && <p className="mt-1 text-sm text-navy-400">{description}</p>}
    </div>
  );
}
