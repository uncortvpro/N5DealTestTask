"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/cn";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await apiClient("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out"
      aria-label="Sign out"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900",
        loading && "opacity-50"
      )}
    >
      <LogOut size={17} />
    </button>
  );
}
