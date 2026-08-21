"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Label, Select, Textarea } from "@/components/ui/Field";

export function StatusControl({
  apiPath,
  currentStatus,
  statusOptions,
}: {
  apiPath: string;
  currentStatus: string;
  statusOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await apiClient(apiPath, {
        method: "PATCH",
        body: JSON.stringify({ status, reason: reason || undefined }),
      });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Change status
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Update status">
        <div className="space-y-3">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          {status !== "ACTIVE" && (
            <div>
              <Label htmlFor="reason">Reason (shown to the affected party)</Label>
              <Textarea
                id="reason"
                rows={3}
                placeholder="e.g. Unverified company information"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant={status === "ACTIVE" ? "primary" : "danger"} onClick={submit} disabled={submitting}>
              {submitting ? "Saving…" : "Confirm"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
