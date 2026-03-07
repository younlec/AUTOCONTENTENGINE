import { AiGenerationService } from './ai-generation.service';
import { GenerateContentDto } from './dto/generate-content.dto';
export declare class AiGenerationController {
    private readonly aiGenerationService;
    constructor(aiGenerationService: AiGenerationService);
    generate(userId: string, dto: GenerateContentDto): Promise<{
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
