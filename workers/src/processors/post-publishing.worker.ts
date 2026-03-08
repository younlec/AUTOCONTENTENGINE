import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export class PostPublishingWorker {
  private worker: Worker | null = null;

  async start() {
    this.worker = new Worker(
      'post-scheduling',
      async (job: Job) => {
        logger.info(`Processing post publishing job: ${job.id}`);
        return this.publishPost(job.data);
      },
      {
        connection: redisConnection,
        concurrency: 2,
        limiter: { max: 10, duration: 60000 },
      },
    );

    this.worker.on('completed', (job) => {
      logger.info(`Post publishing job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Post publishing job ${job?.id} failed`, err);
    });

    logger.info('PostPublishingWorker started');
  }

  private async publishPost(data: { postId: string; userId: string }) {
    const { postId } = data;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { content: true, connectedAccount: true },
    });

    if (!post) throw new Error(`Post ${postId} not found`);

    await prisma.post.update({
      where: { id: postId },
      data: { status: 'PUBLISHING' },
    });

    try {
      const platformPostId = `mock_${post.platform.toLowerCase()}_${Date.now()}`;

      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'POSTED',
          platformPostId,
          publishedAt: new Date(),
        },
      });

      await prisma.analytics.create({
        data: {
          postId,
          platform: post.platform,
          impressions: 0,
          reach: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
      });

      logger.info(`Post ${postId} published to ${post.platform} as ${platformPostId}`);
      return { success: true, platformPostId };
    } catch (error: any) {
      await prisma.post.update({
        where: { id: postId },
        data: { status: 'FAILED', errorMessage: error.message },
      });
      throw error;
    }
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
      logger.info('PostPublishingWorker stopped');
    }
  }
}
