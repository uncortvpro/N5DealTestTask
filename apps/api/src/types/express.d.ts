import type { User } from "@prisma/client";
import type { SessionPayload } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: SessionPayload;
      currentUser?: User;
    }
  }
}

export {};
