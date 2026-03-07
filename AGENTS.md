# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
AutoContent Engine — a NestJS backend SaaS platform for content discovery, creation, scheduling, posting, and monetization across social platforms. Single service at `backend/`.

### Services required
- **PostgreSQL** (port 5432): `sudo service postgresql start`. Database `autocontent`, user `postgres`/`postgres`.
- **Redis** (port 6379): `sudo service redis-server start`. Used by BullMQ job queues.
- **NestJS backend** (port 4000): `npm run start:dev` from `backend/`. Swagger docs at `/api/docs`.

### Key commands (all run from `backend/`)
| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Generate Prisma client | `npx prisma generate` |
| Run migrations | `npx prisma migrate dev` |
| Lint | `npm run lint` |
| Unit tests | `npm test` |
| E2E tests | `npm run test:e2e` (requires running DB + Redis) |
| Build | `npm run build` |
| Dev server | `npm run start:dev` |

### Gotchas
- PostgreSQL and Redis must be running before starting the dev server or running E2E tests. Unit tests (`npm test`) do not require them.
- After any change to `prisma/schema.prisma`, run `npx prisma migrate dev` then `npx prisma generate`.
- BullMQ queues (content-discovery, video-creation, post-scheduling) silently fail to connect if Redis is down; the app still starts but queue-dependent features won't work.
- AI generation endpoints return mock content when `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` are set to placeholder values (the default `.env`).
- The `.env` file has working dev defaults; no external secrets are needed for local development.

### Frontend (Next.js)
- Located at `frontend/`. Runs on port 3000.
- API requests proxy to `http://localhost:4000` via Next.js rewrites in `next.config.js`.
- Auth uses mock fallback: when the backend API is unreachable, login/register still works with mock tokens stored in `localStorage`.
- Dashboard routes live under `src/app/(dashboard)/dashboard/` (route group pattern). The URL path is `/dashboard/overview`, `/dashboard/content`, etc.
- ShadCN UI components are in `src/components/ui/`; layout components in `src/components/layout/`.

| Task | Command (from `frontend/`) |
|------|----------------------------|
| Install deps | `npm install` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Dev server | `npm run dev` |
