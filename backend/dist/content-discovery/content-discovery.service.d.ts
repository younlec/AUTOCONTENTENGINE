import { PrismaService } from '../prisma/prisma.service';
export declare class ContentDiscoveryService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    fetchTrendingTopics(): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        source: string | null;
        score: number;
        category: string | null;
    }[]>;
    getTopics(page?: number, limit?: number): Promise<{
        data: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            source: string | null;
            score: number;
            category: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    rankTopics(topics: {
        score: Float64Array | number;
        category?: string | null;
    }[]): {
        score: Float64Array | number;
        category?: string | null;
    }[];
}
