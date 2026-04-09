#!/bin/sh
set -eu

PROJECT_DIR="."

if [ -d "apps/vbi_be" ]; then
  PROJECT_DIR="apps/vbi_be"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST:-db}:${DB_PORT:-5432}/${POSTGRES_DB}"
  export DATABASE_URL
fi

echo "🛠  Running migrations..."
(cd "$PROJECT_DIR" && pnpm exec prisma migrate dev)

echo "📦 Generating Prisma Client..."
(cd "$PROJECT_DIR" && pnpm exec prisma generate)

echo "🌱 Seeding database..."
(cd "$PROJECT_DIR" && pnpm exec prisma db seed)

echo "🟢 Starting the application..."
exec "$@"
