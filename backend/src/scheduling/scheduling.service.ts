import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('post-scheduling') private readonly schedulingQueue: Queue,
  ) {}

  async schedulePost(userId: string, postId: string, scheduledAt: Date) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const delay = new Date(scheduledAt).getTime() - Date.now();

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt),
      },
    });

    await this.schedulingQueue.add(
      'publish-post',
      { postId, userId },
      { delay: Math.max(delay, 0), jobId: `schedule-${postId}` },
    );

    this.logger.log(`Post ${postId} scheduled for ${scheduledAt}`);

    return { postId, scheduledAt, status: 'SCHEDULED' };
  }

  async cancelScheduledPost(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, userId, status: 'SCHEDULED' },
    });

    if (!post) {
      throw new NotFoundException('Scheduled post not found');
    }

    const job = await this.schedulingQueue.getJob(`schedule-${postId}`);
    if (job) {
      await job.remove();
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'DRAFT', scheduledAt: null },
    });

    return { postId, status: 'CANCELLED' };
  }

  async getScheduledPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { userId, status: 'SCHEDULED' },
      include: { content: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
