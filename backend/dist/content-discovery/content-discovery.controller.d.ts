import { ContentDiscoveryService } from './content-discovery.service';
export declare class ContentDiscoveryController {
    private readonly contentDiscoveryService;
    constructor(contentDiscoveryService: ContentDiscoveryService);
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
    getTopics(page?: string, limit?: string): Promise<{
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
}
