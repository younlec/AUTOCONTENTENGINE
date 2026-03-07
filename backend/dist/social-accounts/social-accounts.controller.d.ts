import { SocialAccountsService } from './social-accounts.service';
import { ConnectAccountDto } from './dto/connect-account.dto';
export declare class SocialAccountsController {
    private readonly socialAccountsService;
    constructor(socialAccountsService: SocialAccountsService);
    connect(userId: string, dto: ConnectAccountDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        platform: import(".prisma/client").$Enums.Platform;
        accessToken: string;
        refreshToken: string | null;
        platformUserId: string;
        userId: string;
        tokenExpiry: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        platform: import(".prisma/client").$Enums.Platform;
        platformUserId: string;
    }[]>;
    disconnect(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        platform: import(".prisma/client").$Enums.Platform;
        accessToken: string;
        refreshToken: string | null;
        platformUserId: string;
        userId: string;
        tokenExpiry: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
