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

  it("rejects a MANAGER hitting buyer-only /api/buyer/profile with 403", async () => {
    const res = await request(app)
      .get("/api/buyer/profile")
      .set("Cookie", sessionCookie(4, "MANAGER"));
    expect(res.status).toBe(403);
  });

  it("rejects a MANAGER hitting the buyer/seller-only contacts inbox with 403", async () => {
    const res = await request(app)
      .get("/api/contacts")
      .set("Cookie", sessionCookie(5, "MANAGER"));
    expect(res.status).toBe(403);
  });

  it("rejects an unauthenticated attempt to publish a listing with 401", async () => {
    const res = await request(app)
      .post("/api/assets")
      .send({ title: "Test", description: "irrelevant", sector: "TECHNOLOGY", region: "GLOBAL", dealSize: 1 });
    expect(res.status).toBe(401);
  });

  it("rejects unauthenticated requests to /api/favorites with 401", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(401);
  });

  it("rejects a SELLER hitting buyer-only /api/favorites with 403", async () => {
    const res = await request(app)
      .get("/api/favorites")
      .set("Cookie", sessionCookie(7, "SELLER"));
    expect(res.status).toBe(403);
  });

  it("rejects an unauthenticated request for a match explanation with 401", async () => {
    const res = await request(app).get("/api/assets/1/match-explanation");
    expect(res.status).toBe(401);
  });
});
