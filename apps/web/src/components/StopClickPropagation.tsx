"use client";

import type { ReactNode } from "react";

/**
 * Wraps a nested interactive element (e.g. an Edit/Status button) inside a
 * card that's itself wrapped in a `<Link>`, so clicking it doesn't also
 * trigger the card's navigation. Has to be its own Client Component: an
 * onClick handler can't be attached to a plain element from inside a
 * Server Component — event handlers aren't serializable across that
 * boundary — even though everything it wraps may itself be server-rendered.
 */
export function StopClickPropagation({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
