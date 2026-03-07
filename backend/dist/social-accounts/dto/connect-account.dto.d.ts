import { Platform } from '@prisma/client';
export declare class ConnectAccountDto {
    platform: Platform;
    accessToken: string;
    refreshToken?: string;
    platformUserId: string;
}
