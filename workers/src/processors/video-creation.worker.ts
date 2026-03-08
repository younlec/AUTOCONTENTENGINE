import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export class VideoCreationWorker {
  private worker: Worker | null = null;

  async start() {
    this.worker = new Worker(
      'video-creation',
      async (job: Job) => {
        logger.info(`Processing video creation job: ${job.id}`);
        return this.createVideo(job.data);
      },
      { connection: redisConnection, concurrency: 1 },
    );

    this.worker.on('completed', (job) => {
      logger.info(`Video creation job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Video creation job ${job?.id} failed`, err);
    });

    logger.info('VideoCreationWorker started');
  }

  private async createVideo(data: { contentId: string; userId: string; format?: string }) {
    const { contentId, userId, format } = data;

    await prisma.video.updateMany({
      where: { contentId, userId },
      data: { status: 'GENERATING' },
    });

    const video = await prisma.video.findFirst({ where: { contentId, userId } });
    if (!video) {
      const newVideo = await prisma.video.create({
        data: {
          contentId,
          userId,
          scriptText: 'Auto-generated script placeholder',
          scenes: [
            { scene: 1, description: 'Hook intro', duration: 3 },
            { scene: 2, description: 'Main content', duration: 15 },
            { scene: 3, description: 'Call to action', duration: 5 },
          ],
          status: 'COMPLETED',
          duration: 23.0,
          format: format || '9:16',
          videoUrl: `https://storage.example.com/videos/${contentId}.mp4`,
          thumbnailUrl: `https://storage.example.com/thumbnails/${contentId}.jpg`,
        },
      });
      logger.info(`Video ${newVideo.id} created for content ${contentId}`);
      return { videoId: newVideo.id };
    }

    await prisma.video.update({
      where: { id: video.id },
      data: { status: 'COMPLETED' },
    });

    logger.info(`Video ${video.id} completed for content ${contentId}`);
    return { videoId: video.id };
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
      logger.info('VideoCreationWorker stopped');
    }
  }
}
