import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateContentDto } from './dto/generate-content.dto';
export declare class AiGenerationService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateContent(userId: string, dto: GenerateContentDto): Promise<{
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
    private generateWithOpenAI;
    private generateWithAnthropic;
    private getMockContent;
    generateCaption(prompt: string): string;
    generateThread(prompt: string): string;
    generateScript(prompt: string): string;
    generateHashtags(prompt: string): string[];
    generateSeoTitle(prompt: string): string;
}
