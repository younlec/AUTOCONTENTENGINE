import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PublishingService } from '../publishing/publishing.service';
export declare class SchedulingProcessor extends WorkerHost {
    private readonly publishingService;
    private readonly logger;
    constructor(publishingService: PublishingService);
    process(job: Job<{
        postId: string;
        userId: string;
    }>): Promise<import("../publishing/adapters/base-adapter").PublishResult>;
}
