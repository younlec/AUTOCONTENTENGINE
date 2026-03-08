FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY workers/package.json workers/package-lock.json* ./workers/
COPY backend/prisma ./prisma/
RUN cd workers && npm ci

FROM base AS builder
COPY --from=deps /app/workers/node_modules ./workers/node_modules
COPY workers/ ./workers/
COPY backend/prisma ./prisma/
RUN cd workers && npx prisma generate --schema=../prisma/schema.prisma
RUN cd workers && npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 worker
COPY --from=builder --chown=worker:nodejs /app/workers/dist ./dist
COPY --from=builder --chown=worker:nodejs /app/workers/node_modules ./node_modules
COPY --from=builder --chown=worker:nodejs /app/prisma ./prisma
USER worker
CMD ["node", "dist/main.js"]
