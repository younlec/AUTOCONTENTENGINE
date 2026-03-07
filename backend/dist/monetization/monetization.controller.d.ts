import { MonetizationService } from './monetization.service';
declare class CreateAffiliateLinkApiDto {
    productName: string;
    productUrl: string;
    affiliateUrl: string;
    program?: string;
    commission?: number;
    contentId?: string;
}
export declare class MonetizationController {
    private readonly monetizationService;
    constructor(monetizationService: MonetizationService);
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
    createAffiliateLink(userId: string, dto: CreateAffiliateLinkApiDto): Promise<{
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
}
export {};
