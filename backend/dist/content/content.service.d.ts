import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateContentDto): Promise<{
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
    }>;
    findAll(userId: string, page?: number, limit?: number, filters?: {
        status?: ContentStatus;
        type?: string;
        platform?: string;
    }): Promise<{
        data: ({
            topic: {
                description: string | null;
                title: string;
                id: string;
                createdAt: Date;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                source: string | null;
                score: number;
                category: string | null;
            } | null;
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        topic: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            source: string | null;
            score: number;
            category: string | null;
        } | null;
        videos: {
            format: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.VideoStatus;
            contentId: string;
            scriptText: string;
            scenes: import("@prisma/client/runtime/library").JsonValue | null;
            videoUrl: string | null;
            thumbnailUrl: string | null;
            duration: number | null;
        }[];
        posts: {
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
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateContentDto): Promise<{
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
    }>;
    updateStatus(id: string, newStatus: ContentStatus): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
