import { ContentType, Platform } from '@prisma/client';
export declare class GenerateContentDto {
    topicId?: string;
    type: ContentType;
    platform?: Platform;
    prompt?: string;
    provider: 'openai' | 'anthropic';
}
