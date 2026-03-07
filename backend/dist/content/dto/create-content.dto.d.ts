import { ContentType, Platform } from '@prisma/client';
export declare class CreateContentDto {
    topicId?: string;
    type: ContentType;
    title: string;
    body: string;
    platform?: Platform;
}
