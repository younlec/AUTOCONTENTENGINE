# AutoContent Engine

Automates content discovery, creation, scheduling, posting, and monetization across social platforms.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, ShadCN UI, React Query, Recharts |
| Backend | NestJS 10, TypeScript, Prisma ORM, BullMQ |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7 |
| Infrastructure | Docker, Docker Compose, Nginx |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7

### Backend
```bash
cd backend
npm install
cp .env.example .env          # adjust if needed
npx prisma migrate dev
npx prisma generate
npm run start:dev              # http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                    # http://localhost:3000
```

### Docker (production)
```bash
docker compose up -d           # starts all services
```

## Project Structure

```
├── backend/                   # NestJS API server
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── users/             # User management
│   │   ├── social-accounts/   # Social platform connections
│   │   ├── content-discovery/ # Trending topic discovery
│   │   ├── ai-generation/     # OpenAI/Claude content generation
│   │   ├── video-creation/    # AI video pipeline
│   │   ├── content/           # Content CRUD + status workflow
│   │   ├── scheduling/        # BullMQ smart scheduler
│   │   ├── publishing/        # Multi-platform publishing
│   │   ├── analytics/         # Performance metrics
│   │   ├── monetization/      # Affiliate links + revenue
│   │   └── events/            # WebSocket real-time updates
│   └── prisma/                # Database schema + migrations
├── frontend/                  # Next.js 14 dashboard
│   └── src/
│       ├── app/               # App Router pages
│       ├── components/        # ShadCN UI + layout components
│       ├── hooks/             # Auth state (Zustand)
│       └── lib/               # API client, utilities
├── docker/                    # Dockerfiles + Nginx config
├── docker-compose.yml         # Full stack orchestration
└── .env.example               # Environment variable template
```

## API Documentation

Swagger UI available at `http://localhost:4000/api/docs` when the backend is running.

## Content Workflow

```
Draft → Review → Approved → Scheduled → Posted
```

All content requires manual approval before publishing (human-in-the-loop safety).

## Environment Variables

See `.env.example` at project root and `backend/.env.example` for all configuration options.
