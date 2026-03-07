import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(userId: string): Promise<{
        totalPosts: number;
        totalImpressions: number;
        totalReach: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
        totalSaves: number;
        totalClicks: number;
        totalWatchHours: number;
        totalSubscriberDelta: number;
    }>;
    getPostAnalytics(postId: string): Promise<{
        id: string;
        createdAt: Date;
        platform: import(".prisma/client").$Enums.Platform;
        postId: string;
        impressions: number;
        reach: number;
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        clicks: number;
        watchHours: number;
        subscriberDelta: number;
    }[]>;
    getPerformanceMetrics(userId: string): Promise<{
        postId: string;
        contentTitle: string;
        platform: import(".prisma/client").$Enums.Platform;
        publishedAt: Date | null;
        metrics: {
            id: string;
            createdAt: Date;
            platform: import(".prisma/client").$Enums.Platform;
            postId: string;
            impressions: number;
            reach: number;
            likes: number;
            comments: number;
            shares: number;
            saves: number;
            clicks: number;
            watchHours: number;
            subscriberDelta: number;
        };
    }[]>;
}
