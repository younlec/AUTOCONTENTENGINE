import { Queue } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { logger } from '../lib/logger';

export class TrendScheduler {
  private queue: Queue;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly intervalMs: number;

  constructor() {
    this.queue = new Queue('content-discovery', { connection: redisConnection });
    this.intervalMs = parseInt(process.env.TREND_DISCOVERY_INTERVAL_MS || '1800000', 10);
  }

  async start() {
    await this.enqueueTrendDiscovery();

    this.intervalId = setInterval(() => {
      this.enqueueTrendDiscovery().catch((err) =>
        logger.error('Failed to enqueue trend discovery', err),
      );
    }, this.intervalMs);

    logger.info(`TrendScheduler started (interval: ${this.intervalMs}ms)`);
  }

  private async enqueueTrendDiscovery() {
    const job = await this.queue.add('discover-trends', {
      source: 'scheduled',
      region: 'global',
      timestamp: new Date().toISOString(),
    });
    logger.info(`Enqueued trend discovery job: ${job.id}`);
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      logger.info('TrendScheduler stopped');
    }
    await this.queue.close();
  }
}
