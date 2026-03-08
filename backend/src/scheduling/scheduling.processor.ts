import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PublishingService } from '../publishing/publishing.service';
import { EventsGateway } from '../events/events.gateway';

@Processor('post-scheduling')
export class SchedulingProcessor extends WorkerHost {
  private readonly logger = new Logger(SchedulingProcessor.name);

  constructor(
    private readonly publishingService: PublishingService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super();
  }

  async process(job: Job<{ postId: string; userId: string }>) {
    this.logger.log(`Processing scheduled post: ${job.data.postId}`);

    this.eventsGateway.emitPostStatus(job.data.postId, 'PUBLISHING');

    try {
      const result = await this.publishingService.publishPost(job.data.postId);
      this.logger.log(
        `Scheduled post ${job.data.postId} published successfully`,
      );

      this.eventsGateway.emitPostStatus(job.data.postId, 'POSTED');
      this.eventsGateway.emitPostPublished({
        postId: job.data.postId,
        platform: 'unknown',
        publishedAt: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to publish scheduled post ${job.data.postId}`,
        error,
      );
      this.eventsGateway.emitPostStatus(job.data.postId, 'FAILED');
      throw error;
    }
  }
}
