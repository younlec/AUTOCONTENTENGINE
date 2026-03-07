import { VideoCreationService } from './video-creation.service';
import { CreateVideoDto } from './dto/create-video.dto';
export declare class VideoCreationController {
    private readonly videoCreationService;
    constructor(videoCreationService: VideoCreationService);
    generate(userId: string, dto: CreateVideoDto): Promise<{
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
}
