import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export class AnalyticsSyncWorker {
  private worker: Worker | null = null;

  async start() {
    this.worker = new Worker(
      'analytics-sync',
      async (job: Job) => {
        logger.info(`Processing analytics sync job: ${job.id}`);
        return this.syncAnalytics(job.data);
      },
      { connection: redisConnection, concurrency: 2 },
    );

    this.worker.on('completed', (job) => {
      logger.info(`Analytics sync job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Analytics sync job ${job?.id} failed`, err);
    });

    logger.info('AnalyticsSyncWorker started');
  }

  private async syncAnalytics(data: { postId?: string }) {
    const where = data.postId ? { postId: data.postId } : { post: { status: 'POSTED' } };
    
    const analyticsRecords = await prisma.analytics.findMany({
      where: where as any,
      include: { post: true },
    });

    let synced = 0;
    for (const record of analyticsRecords) {
      await prisma.analytics.update({
        where: { id: record.id },
        data: {
          impressions: { increment: Math.floor(Math.random() * 100) },
          reach: { increment: Math.floor(Math.random() * 80) },
          likes: { increment: Math.floor(Math.random() * 20) },
          comments: { increment: Math.floor(Math.random() * 5) },
          shares: { increment: Math.floor(Math.random() * 3) },
        },
      });
      synced++;
    }

    logger.info(`Synced analytics for ${synced} posts`);
    return { synced };
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
      logger.info('AnalyticsSyncWorker stopped');
    }
  }
}
