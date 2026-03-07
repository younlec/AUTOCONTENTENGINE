import { ContentType, Platform } from '@prisma/client';
export declare class UpdateContentDto {
    type?: ContentType;
    title?: string;
    body?: string;
    platform?: Platform;
}
