# N5Deal Marketplace Prototype

A working prototype of an M&A / financial-asset marketplace with three roles — **Buyer**, **Seller**, and **Platform Manager** — built as a technical-assignment submission.

## Quick start (Docker — recommended)

Requires Docker + Docker Compose.

```bash
cp .env.example .env   # optional: set your own JWT_SECRET
docker compose up --build
```

This builds and starts three containers (MySQL, the Express API, the Next.js web app). On first boot the API container automatically runs Prisma migrations and seeds demo data — no manual steps required.

- Web app: http://localhost:3000
- API (direct): http://localhost:4000

To reset all data: `docker compose down -v && docker compose up --build`.

### Demo accounts

All seeded accounts share the password `Password123!`.

| Role    | Emails |
|---------|--------|
| Manager | `manager1@n5deal.com`, `manager2@n5deal.com` |
| Seller  | `seller1@n5deal.com` … `seller5@n5deal.com` |
| Buyer   | `buyer1@n5deal.com` … `buyer8@n5deal.com` |

The seed also pre-suspends one buyer account and one asset listing, so the Manager's moderation effects are visible immediately without any extra clicks.

## Quick start (local dev, no Docker)

Requires Node 20+, pnpm (`corepack enable`), and a local MySQL instance.

```bash
pnpm install
pnpm run build:shared          # builds packages/shared once

cd apps/api
cp .env.example .env           # set DATABASE_URL to your local MySQL
pnpm exec prisma migrate deploy
pnpm run seed
pnpm run dev                   # http://localhost:4000

# in a second terminal
cd apps/web
pnpm run dev                   # http://localhost:3000
```

Run the API test suite with `pnpm test` from either the repo root or `apps/api`.

## Architecture

```
apps/web       Next.js 14 (App Router) + TypeScript + Tailwind — UI only
apps/api       Node.js + Express + TypeScript + Prisma — REST API, auth, business logic
packages/shared  zod schemas, shared TS types, the match-score algorithm — imported by both apps
```

pnpm workspaces tie the three packages together. Docker Compose orchestrates `mysql` + `api` + `web`.

**Why a separate Node backend instead of Next.js API routes.** The brief left this open; I chose a standalone Express service so auth, business rules, and database access live behind a real REST contract with its own deployable boundary, rather than being colocated with the UI. It also makes the API independently testable (see `apps/api/tests`).

**Web ↔ API wiring.** `apps/web/next.config.mjs` rewrites `/api/*` to the internal API container. The browser only ever talks to one origin, so the API can set a plain `httpOnly` session cookie without CORS/cross-site-cookie complications. Note: Next.js resolves `rewrites()` at *build* time and bakes the result into the production output, so `API_INTERNAL_URL` is set as a Docker build ARG (default `http://api:4000`, matching the Compose service name), not just a runtime env var.

**Auth.** Express issues a JWT on register/login (bcrypt-hashed passwords), set as an `httpOnly`, `sameSite=lax` cookie. Every protected Express route is guarded by `requireAuth` / `requireRole` / `loadCurrentUser` (the last re-checks the DB so a suspended account is locked out immediately, not just until its token expires) — this is the real security boundary. Next.js layouts (`apps/web/src/app/*/layout.tsx`) additionally call `/api/auth/me` server-side and redirect before rendering; this is a UX nicety (no client-side flash of protected content) layered on top of, not instead of, the API-side checks.

**Data model** (`apps/api/prisma/schema.prisma`, MySQL): `User` (role, status, optional suspension reason/timestamp), `BuyerProfile` with `BuyerSector`/`BuyerRegion` join tables (MySQL has no native array column type, so multi-select sectors/regions are normalized many-to-many), `Asset` (status: ACTIVE/SUSPENDED/REMOVED, same reason/timestamp pattern), `Conversation` + `Message` for the contact/messaging flow.

**Match-score — the "Smart Filtering" AI feature** (`packages/shared/src/matching.ts`). A deterministic, unit-tested 0–100 fit score between a buyer's investment profile and an asset:
- +40 if the asset's sector is one the buyer selected
- +25 if the asset's region matches (a buyer who selected "Global" matches any region)
- +35 for deal-size fit within the buyer's ticket-size range, degrading linearly for the 25% just outside that range instead of a hard cutoff (real buyers stay flexible near the edges)

It's used in both directions: buyers see assets ranked and badged by fit against their own profile (`GET /api/match/assets`); sellers see buyers ranked by fit against their own active listings (`GET /api/buyers`). I chose a deterministic algorithm over an LLM call so the demo is instant, free, and doesn't depend on an external API key — see "what I'd improve" for the LLM-based extension I'd add next.

**Progressive Web App.** The web app is installable: `apps/web/src/app/manifest.ts` (Next.js's manifest file convention) declares name/icons/`display: standalone`, favicon and app icons are generated on the fly via `next/og` (no binary image assets to keep in sync), and a hand-rolled service worker (`apps/web/public/sw.js`) caches static assets and serves an offline fallback page — network-first for pages, and `/api/*` is deliberately never cached so a signed-in user never sees stale or another session's data offline. Registered client-side only in production (`PwaRegister.tsx`), so it doesn't interfere with dev-mode hot reload.

## Assumptions

- Only Buyer/Seller can self-register; Manager accounts are seeded, not self-served (a real deployment would provision these out-of-band).
- One conversation thread per (buyer, seller, asset) triple — a buyer can open separate threads with the same seller about different assets.
- Buyer and seller identities are visible to each other once a conversation starts (no blind/anonymized listings — see below).
- Deal size / revenue / EBITDA are stored as whole-dollar integers; no multi-currency support.
- A Manager cannot suspend another Manager account through the moderation UI (guards against accidental lockout of all admins).

## AI tools used

Built end-to-end with **Claude Code** (Sonnet 5): architecture and data-model design, the Express API and Prisma schema, the Next.js frontend, Docker multi-stage builds, the match-score algorithm and its tests, and this README. I drove the process interactively — reviewed the generated schema and route logic, ran the type-checker/test suite/Docker build myself and fixed the issues that came up (config caching in `next.config.mjs`, a missing `.dockerignore`, a couple of Prisma/TypeScript friction points), rather than accepting output unreviewed.

## What I'd improve with more time

- **LLM-generated match explanations.** The "Why this matches" card currently shows three deterministic sub-scores (sector/region/deal-size fit) as bars. The natural next step is a real LLM call that turns the buyer profile + listing into a one- or two-sentence rationale ("Fits because you're looking for recurring-revenue SaaS in North America, and this one has 90% net revenue retention with a founder seeking a full exit") — genuine AI reasoning layered on top of the deterministic score, not just another weighted feature.
- **Semantic matching via embeddings.** Sector/region matching today is enum-based, so a buyer thesis written as "vertical SaaS for logistics" won't match a listing described as "niche software platform for freight operators" even though they're a strong fit. Embedding `investmentThesis` and `description`, then blending cosine similarity into the existing score, would catch fits the categorical fields miss — a meaningfully different matching approach from rule-based weights, not just a bigger version of the same thing.
- **LLM-powered natural-language search** ("SaaS companies in Europe under $10M") that parses free text into the existing filter set, layered on top of the deterministic match score.
- **Blind/anonymized listings** — reveal seller identity only after both sides opt in, closer to real M&A marketplace conventions.
- **Real-time messaging** (WebSocket/SSE) — the inbox currently polls every 5s (`ContactsShell.tsx`, paused when the tab is hidden) rather than pushing updates, which was the pragmatic choice for the assignment's time box.
- **i18n** (EN/RU), pagination for large result sets, an audit log for manager actions, and a leaner production Docker image (the current runtime stage keeps devDependencies for simplicity — see comment in `docker/Dockerfile.api`).
- **Automated end-to-end tests** (Playwright) covering full user journeys in the browser, on top of the current API-level unit/integration suite.

## Testing

```bash
pnpm test   # from repo root or apps/api — Vitest
```

48 tests across four files, all without needing a live database: the match-score algorithm (perfect/zero/partial-credit/edge cases), zod schema validation for every request-body schema (including the `.strict()` mass-assignment guard and business rules like "MANAGER isn't a self-registerable role"), the pretty-URL slug helpers (`slugify` / `toSlugPath` / `idFromSlugPath`, including their round-trip), and authorization-guard behavior (401 unauthenticated, 403 wrong role) across every router. Route tests are deliberately scoped to paths that fail before touching Prisma — `requireAuth`/`requireRole` run ahead of any DB call on most routers, so the guard itself is what's under test, not a live connection.
