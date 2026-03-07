import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PublishingService } from '../publishing/publishing.service';

@Processor('post-scheduling')
export class SchedulingProcessor extends WorkerHost {
  private readonly logger = new Logger(SchedulingProcessor.name);

  constructor(private readonly publishingService: PublishingService) {
    super();
  }

  async process(job: Job<{ postId: string; userId: string }>) {
    this.logger.log(`Processing scheduled post: ${job.data.postId}`);

    try {
      const result = await this.publishingService.publishPost(job.data.postId);
      this.logger.log(
        `Scheduled post ${job.data.postId} published successfully`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to publish scheduled post ${job.data.postId}`,
        error,
      );
      throw error;
    }
  }
}
