import { PrismaService } from '../prisma/prisma.service';
import { ConnectAccountDto } from './dto/connect-account.dto';
export declare class SocialAccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findAllByUser(userId: string): Promise<{
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
