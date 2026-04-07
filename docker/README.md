# VBI Docker Environment

## Quick Start

Production Mode:

```bash
pnpm vbi:prod:build
```

Development Mode:

```bash
pnpm vbi:dev:build
```

## Common Commands

Development:

```bash
pnpm vbi:dev
pnpm vbi:dev:build
pnpm vbi:dev:logs
pnpm vbi:dev:down
pnpm vbi:dev:rebuild
```

Production:

```bash
pnpm vbi:prod
pnpm vbi:prod:build
pnpm vbi:prod:logs
pnpm vbi:prod:down
pnpm vbi:prod:rebuild
```

Frontend: <http://localhost:3000>
Backend: <http://localhost:3030>
Database: `localhost:5454`

## Notes

- Containers connect to Postgres through `db:5432`.
- The host machine connects to Postgres through `localhost:5454`.
- Backend entrypoints derive `DATABASE_URL` from `POSTGRES_*`, `DB_HOST`, and `DB_PORT` when needed.
- Dev and prod compose files use different project names, so they can be run independently.
- Host ports can be overridden with `VBI_FE_PORT`, `VBI_BE_PORT`, `VBI_COLLAB_PORT`, `VBI_DEBUG_PORT`, and `VBI_DB_PORT`.
