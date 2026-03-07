import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
export declare class VideoCreationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateVideo(userId: string, dto: CreateVideoDto): Promise<{
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
    }>;
    checkStatus(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VideoStatus;
        videoUrl: string | null;
        thumbnailUrl: string | null;
        duration: number | null;
    }>;
    private breakdownScenes;
}
