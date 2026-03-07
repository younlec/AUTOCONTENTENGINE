"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonetizationService = exports.CreateAffiliateLinkDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class CreateAffiliateLinkDto {
}
exports.CreateAffiliateLinkDto = CreateAffiliateLinkDto;
let MonetizationService = class MonetizationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId) {
        const affiliateLinks = await this.prisma.affiliateLink.findMany({
            where: { userId },
        });
        const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0);
        const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
        const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);
        return {
            totalRevenue,
            totalClicks,
            totalConversions,
            conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
            activeLinks: affiliateLinks.length,
            topLinks: affiliateLinks
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5),
        };
    }
    async createAffiliateLink(userId, dto) {
        return this.prisma.affiliateLink.create({
            data: {
                userId,
                contentId: dto.contentId,
                productName: dto.productName,
                productUrl: dto.productUrl,
                affiliateUrl: dto.affiliateUrl,
                program: dto.program,
                commission: dto.commission || 0,
            },
        });
    }
    async getAffiliateLinks(userId) {
        return this.prisma.affiliateLink.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async suggestProducts(category) {
        const suggestions = [
            {
                name: 'Content Creation Toolkit',
                url: 'https://example.com/toolkit',
                category: 'Tools',
                estimatedCommission: 15,
            },
            {
                name: 'Social Media Masterclass',
                url: 'https://example.com/course',
                category: 'Education',
                estimatedCommission: 30,
            },
            {
                name: 'Video Editing Software',
                url: 'https://example.com/editor',
                category: 'Software',
                estimatedCommission: 20,
            },
            {
                name: 'SEO Analysis Tool',
                url: 'https://example.com/seo',
                category: 'Tools',
                estimatedCommission: 25,
            },
        ];
        if (category) {
            return suggestions.filter((s) => s.category.toLowerCase() === category.toLowerCase());
        }
        return suggestions;
    }
};
exports.MonetizationService = MonetizationService;
exports.MonetizationService = MonetizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonetizationService);
//# sourceMappingURL=monetization.service.js.map