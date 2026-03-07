import { PrismaService } from '../prisma/prisma.service';
export declare class CreateAffiliateLinkDto {
    productName: string;
    productUrl: string;
    affiliateUrl: string;
    program?: string;
    commission?: number;
    contentId?: string;
}
export declare class MonetizationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
        totalRevenue: number;
        totalClicks: number;
        totalConversions: number;
        conversionRate: number;
        activeLinks: number;
        topLinks: {
            id: string;
            createdAt: Date;
            userId: string;
            contentId: string | null;
            clicks: number;
            productName: string;
            productUrl: string;
            affiliateUrl: string;
            program: string | null;
            commission: number;
            conversions: number;
            revenue: number;
        }[];
    }>;
    createAffiliateLink(userId: string, dto: CreateAffiliateLinkDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        contentId: string | null;
        clicks: number;
        productName: string;
        productUrl: string;
        affiliateUrl: string;
        program: string | null;
        commission: number;
        conversions: number;
        revenue: number;
    }>;
    getAffiliateLinks(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        contentId: string | null;
        clicks: number;
        productName: string;
        productUrl: string;
        affiliateUrl: string;
        program: string | null;
        commission: number;
        conversions: number;
        revenue: number;
    }[]>;
    suggestProducts(category: string): Promise<{
        name: string;
        url: string;
        category: string;
        estimatedCommission: number;
    }[]>;
}
