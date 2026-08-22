import {
  Briefcase,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  Star,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@n5deal/shared";
import type { NavItem } from "@/components/NavBar";

export function getNavItems(role: Role): (NavItem & { icon: LucideIcon })[] {
  switch (role) {
    case "BUYER":
      return [
        { href: "/buyer", label: "Browse Assets", icon: Search },
        { href: "/buyer/saved", label: "Saved", icon: Star },
        { href: "/contacts", label: "Messages", icon: MessageSquare },
      ];
    case "SELLER":
      return [
        { href: "/seller", label: "My Listings", icon: Briefcase },
        { href: "/seller/buyers", label: "Browse Buyers", icon: Users },
        { href: "/contacts", label: "Messages", icon: MessageSquare },
      ];
    case "MANAGER":
      return [
        { href: "/manager", label: "Overview", icon: LayoutDashboard },
        { href: "/manager/buyers", label: "Buyers", icon: Users },
        { href: "/manager/sellers", label: "Sellers", icon: Briefcase },
        { href: "/manager/assets", label: "Assets", icon: Package },
        { href: "/manager/taxonomy", label: "Sectors & Regions", icon: Tags },
      ];
  }
}
