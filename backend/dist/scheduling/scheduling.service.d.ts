import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class SchedulingService {
    private readonly prisma;
    private readonly schedulingQueue;
    private readonly logger;
    constructor(prisma: PrismaService, schedulingQueue: Queue);
    schedulePost(userId: string, postId: string, scheduledAt: Date): Promise<{
        postId: string;
        scheduledAt: Date;
        status: string;
    }>;
    cancelScheduledPost(userId: string, postId: string): Promise<{
        postId: string;
        status: string;
    }>;
    getScheduledPosts(userId: string): Promise<({
        content: {
            type: import(".prisma/client").$Enums.ContentType;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            platform: import(".prisma/client").$Enums.Platform | null;
            userId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            topicId: string | null;
            body: string;
            status: import(".prisma/client").$Enums.ContentStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        platform: import(".prisma/client").$Enums.Platform;
        userId: string;
        status: import(".prisma/client").$Enums.PostStatus;
        contentId: string;
        connectedAccountId: string;
        platformPostId: string | null;
        scheduledAt: Date | null;
        publishedAt: Date | null;
        errorMessage: string | null;
    })[]>;
}
