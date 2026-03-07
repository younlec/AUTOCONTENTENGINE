# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
AutoContent Engine — a full-stack SaaS platform for content discovery, creation, scheduling, posting, and monetization across social platforms. Backend at `backend/`, frontend at `frontend/`, Docker configs at `docker/`.

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

### Docker (production)
- `docker-compose.yml` at repo root defines: postgres, redis, backend, frontend, nginx.
- For **local dev**, use native PostgreSQL + Redis (see above) rather than Docker containers.
- Docker is only needed for production builds: `sudo docker compose up -d`

### Architecture notes
- Backend uses NestJS 10 modular architecture: 13 modules under `backend/src/` (auth, users, social-accounts, content-discovery, ai-generation, video-creation, content, scheduling, publishing, analytics, monetization, prisma, events).
- Prisma schema at `backend/prisma/schema.prisma` with 10 models (User, ConnectedAccount, Topic, Content, Video, Post, Analytics, AffiliateLink, AuditLog).
- BullMQ queues: `content-discovery`, `video-creation`, `post-scheduling` — all require Redis.
- WebSocket gateway at `backend/src/events/` for real-time updates.
- Frontend uses Next.js 14 App Router with ShadCN UI, Recharts for analytics, Zustand for auth state.
