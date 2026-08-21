"use client";

import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Dialog({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Portalled straight to <body>: rendering inline would make this a
  // descendant of whatever card/row was hovered/clicked to open it. If
  // that ancestor has an active `transform` (e.g. a hover-lift card), CSS
  // makes it the containing block for `position: fixed` descendants, so
  // the "fullscreen" backdrop ends up clipped to that ancestor's box
  // instead of the viewport. A portal sidesteps the whole class of bug.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 backdrop-blur-sm"
      style={{ animation: "dialog-overlay-in 150ms ease-out" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "dialog-panel-in 150ms ease-out" }}
        className={cn("flex max-h-[85vh] w-full flex-col rounded-xl bg-white shadow-2xl", maxWidth)}
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-semibold text-navy-950">{title}</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-700" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
