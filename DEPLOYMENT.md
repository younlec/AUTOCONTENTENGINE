# Deployment Guide

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7

### Start Services
```bash
# Start PostgreSQL and Redis
sudo service postgresql start
sudo service redis-server start

# Backend (port 4000)
cd backend && npm install && npx prisma migrate dev && npm run start:dev

# Frontend (port 3000)
cd frontend && npm install && npm run dev

# Workers (background processors)
cd workers && npm install && npm run start:dev
```

## Docker Deployment

```bash
docker compose up -d
```

This starts: PostgreSQL, Redis, Backend, Frontend, Workers, Nginx.

## Cloud Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend/`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_WS_URL` = your WebSocket URL

### Backend + Workers → AWS EC2 / Container Platform
1. Push Docker images to GitHub Container Registry (automatic via CI/CD)
2. Pull images on your server
3. Use `docker-compose.yml` to orchestrate

### Database → Managed PostgreSQL
- AWS RDS, Supabase, or Neon
- Set `DATABASE_URL` environment variable

### Redis → Managed Redis
- AWS ElastiCache or Upstash
- Set `REDIS_HOST` and `REDIS_PORT`

## CI/CD

The GitHub Actions pipeline (`.github/workflows/ci.yml`):
1. **On PR**: Lint + Test backend, Lint + Build frontend
2. **On push to main**: Build Docker images → Push to GHCR → Deploy to server

### Required GitHub Secrets
- `DEPLOY_HOST`: Server IP/hostname
- `DEPLOY_USER`: SSH username
- `DEPLOY_KEY`: SSH private key
