#!/bin/sh
set -e

echo "Running database migrations..."
pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma

echo "Seeding database (no-op if data already exists)..."
pnpm exec tsx prisma/seed.ts

echo "Starting API server..."
exec node dist/index.js
