import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { SESSION_COOKIE, signSession } from "../src/lib/jwt";

function sessionCookie(userId: number, role: "BUYER" | "SELLER" | "MANAGER") {
  return `${SESSION_COOKIE}=${signSession({ userId, role })}`;
}

const app = createApp();

describe("authorization guards", () => {
  it("rejects unauthenticated requests to protected routes with 401", async () => {
    const res = await request(app).get("/api/manager/stats");
    expect(res.status).toBe(401);
  });

  it("rejects a BUYER hitting manager-only routes with 403", async () => {
    const res = await request(app)
      .get("/api/manager/stats")
      .set("Cookie", sessionCookie(1, "BUYER"));
    expect(res.status).toBe(403);
  });

  it("rejects a SELLER hitting buyer-only routes with 403", async () => {
    const res = await request(app)
      .get("/api/buyer/profile")
      .set("Cookie", sessionCookie(2, "SELLER"));
    expect(res.status).toBe(403);
  });

  it("rejects a BUYER hitting seller/manager-only buyers listing with 403", async () => {
    const res = await request(app)
      .get("/api/buyers")
      .set("Cookie", sessionCookie(3, "BUYER"));
    expect(res.status).toBe(403);
  });

  it("rejects an invalid/tampered session cookie as unauthenticated", async () => {
    const res = await request(app)
      .get("/api/manager/stats")
      .set("Cookie", `${SESSION_COOKIE}=not-a-real-token`);
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
