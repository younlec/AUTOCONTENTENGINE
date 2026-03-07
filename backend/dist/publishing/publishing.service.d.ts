import { PrismaService } from '../prisma/prisma.service';
import { PublishResult } from './adapters/base-adapter';
export declare class PublishingService {
    private readonly prisma;
    private readonly logger;
    private readonly instagramAdapter;
    private readonly facebookAdapter;
    private readonly twitterAdapter;
    private readonly youtubeAdapter;
    constructor(prisma: PrismaService);
    publishPost(postId: string): Promise<PublishResult>;
    private publishToPlatform;
}
