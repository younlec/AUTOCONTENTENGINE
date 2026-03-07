import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateAffiliateLinkDto {
  productName: string;
  productUrl: string;
  affiliateUrl: string;
  program?: string;
  commission?: number;
  contentId?: string;
}

@Injectable()
export class MonetizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const affiliateLinks = await this.prisma.affiliateLink.findMany({
      where: { userId },
    });

    const totalRevenue = affiliateLinks.reduce(
      (sum, link) => sum + link.revenue,
      0,
    );
    const totalClicks = affiliateLinks.reduce(
      (sum, link) => sum + link.clicks,
      0,
    );
    const totalConversions = affiliateLinks.reduce(
      (sum, link) => sum + link.conversions,
      0,
    );

    return {
      totalRevenue,
      totalClicks,
      totalConversions,
      conversionRate:
        totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      activeLinks: affiliateLinks.length,
      topLinks: affiliateLinks
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    };
  }

  async createAffiliateLink(userId: string, dto: CreateAffiliateLinkDto) {
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

  async getAffiliateLinks(userId: string) {
    return this.prisma.affiliateLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async suggestProducts(category: string) {
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
      return suggestions.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase(),
      );
    }
    return suggestions;
  }
}
