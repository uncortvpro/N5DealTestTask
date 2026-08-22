"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PublicUser, Role } from "@n5deal/shared";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/Avatar";
import { LogoutButton } from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";
import { getNavItems } from "@/lib/navItems";

export interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
}

const ROLE_LABEL: Record<PublicUser["role"], string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
  MANAGER: "Manager",
};

const PROFILE_HREF: Partial<Record<Role, string>> = {
  BUYER: "/buyer/profile",
};

export function NavBar({ user, unreadCount = 0 }: { user: PublicUser; unreadCount?: number }) {
  const pathname = usePathname();
  const items = getNavItems(user.role);
  const profileHref = PROFILE_HREF[user.role];
  const onProfile = profileHref ? pathname.startsWith(profileHref) : false;

  // The profile page lives under a section's path (e.g. /buyer/profile) but
  // isn't one of that section's nav items, so it must never make that item
  // read as "active" — it's reached via the avatar, not the tab.
  function isNavItemActive(href: string): boolean {
    if (onProfile) return false;
    if (pathname === href) return true;
    if (!pathname.startsWith(`${href}/`)) return false;

    // Prefer the most specific matching item so a nested-but-distinct route
    // (e.g. /buyer/saved under the /buyer prefix) doesn't also light up its
    // shorter sibling tab (e.g. Browse Assets) at the same time.
    const hasMoreSpecificMatch = items.some(
      (other) =>
        other.href.length > href.length &&
        (pathname === other.href || pathname.startsWith(`${other.href}/`))
    );
    return !hasMoreSpecificMatch;
  }

  const identity = (
    <div className="flex items-center gap-3">
      <span className="hidden rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700 sm:inline-block">
        {ROLE_LABEL[user.role]}
      </span>
      <div className="hidden text-right md:block">
        <p className="text-sm font-medium leading-tight text-navy-900">{user.name}</p>
        <p className="text-xs leading-tight text-navy-400">{user.company ?? "—"}</p>
      </div>
      <Avatar
        name={user.name}
        className={cn("h-9 w-9", onProfile && "ring-2 ring-gold-400 ring-offset-2")}
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-10 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo textClassName="hidden sm:inline" />
          <nav className="hidden items-center gap-1 sm:flex">
            {items.map((item) => {
              const active = isNavItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900",
                    active && "bg-gold-50 text-navy-950 ring-1 ring-inset ring-gold-400/40 hover:bg-gold-50 hover:text-navy-950"
                  )}
                >
                  {item.icon && <item.icon size={14} className={active ? "text-gold-600" : ""} />}
                  {item.label}
                  {item.href === "/contacts" && unreadCount > 0 && (
                    <UnreadBadge count={unreadCount} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {profileHref ? (
            <Link href={profileHref} title="My profile" className="rounded-full transition-opacity hover:opacity-80">
              {identity}
            </Link>
          ) : (
            identity
          )}
          <LogoutButton />
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-navy-100 px-4 py-1.5 sm:hidden">
        {items.map((item) => {
          const active = isNavItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50",
                active && "bg-gold-50 text-navy-950 ring-1 ring-inset ring-gold-400/40"
              )}
            >
              {item.icon && <item.icon size={13} className={active ? "text-gold-600" : ""} />}
              {item.label}
              {item.href === "/contacts" && unreadCount > 0 && <UnreadBadge count={unreadCount} />}
            </Link>
          );
        })}
      </nav>
      <div className="h-[2px] bg-gradient-to-r from-navy-950 via-gold-400 to-navy-950" />
    </header>
  );
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
