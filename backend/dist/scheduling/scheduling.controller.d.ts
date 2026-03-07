import { SchedulingService } from './scheduling.service';
declare class SchedulePostDto {
    postId: string;
    scheduledAt: string;
}
export declare class SchedulingController {
    private readonly schedulingService;
    constructor(schedulingService: SchedulingService);
    schedule(userId: string, dto: SchedulePostDto): Promise<{
        postId: string;
        scheduledAt: Date;
        status: string;
    }>;
    cancel(userId: string, id: string): Promise<{
        postId: string;
        status: string;
    }>;
    findAll(userId: string): Promise<({
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
export {};
