import type { Role } from "@n5deal/shared";

export function roleHome(role: Role): string {
  switch (role) {
    case "BUYER":
      return "/buyer";
    case "SELLER":
      return "/seller";
    case "MANAGER":
      return "/manager";
  }
}
