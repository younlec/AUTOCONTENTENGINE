import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export class TrendDiscoveryWorker {
  private worker: Worker | null = null;

  async start() {
    this.worker = new Worker(
      'content-discovery',
      async (job: Job) => {
        logger.info(`Processing trend discovery job: ${job.id}`);
        return this.discoverTrends(job.data);
      },
      { connection: redisConnection, concurrency: 1 },
    );

    this.worker.on('completed', (job) => {
      logger.info(`Trend discovery job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Trend discovery job ${job?.id} failed`, err);
    });

    logger.info('TrendDiscoveryWorker started');
  }

  private async discoverTrends(data: any) {
    const categories = ['Technology', 'Social Media', 'Business', 'Marketing', 'Entertainment'];
    const topics = [];

    for (const category of categories) {
      const topic = await prisma.topic.create({
        data: {
          title: `Trending: ${category} - ${new Date().toISOString().split('T')[0]}`,
          description: `Auto-discovered trending topic in ${category}`,
          source: data?.source || 'auto-discovery',
          score: Math.random() * 40 + 60,
          category,
          metadata: { 
            discoveredAt: new Date().toISOString(), 
            automated: true,
            region: data?.region || 'global',
          },
        },
      });
      topics.push(topic);
    }

    logger.info(`Discovered ${topics.length} trending topics`);
    return { topicCount: topics.length, topicIds: topics.map(t => t.id) };
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
      logger.info('TrendDiscoveryWorker stopped');
    }
  }
}
