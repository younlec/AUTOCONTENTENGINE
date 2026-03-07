import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: { userId, status: 'POSTED' },
      include: { analytics: true },
    });

    const totals = {
      totalPosts: posts.length,
      totalImpressions: 0,
      totalReach: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0,
      totalClicks: 0,
      totalWatchHours: 0,
      totalSubscriberDelta: 0,
    };

    for (const post of posts) {
      for (const a of post.analytics) {
        totals.totalImpressions += a.impressions;
        totals.totalReach += a.reach;
        totals.totalLikes += a.likes;
        totals.totalComments += a.comments;
        totals.totalShares += a.shares;
        totals.totalSaves += a.saves;
        totals.totalClicks += a.clicks;
        totals.totalWatchHours += a.watchHours;
        totals.totalSubscriberDelta += a.subscriberDelta;
      }
    }

    return totals;
  }

  async getPostAnalytics(postId: string) {
    const analytics = await this.prisma.analytics.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });

    if (analytics.length === 0) {
      throw new NotFoundException('No analytics found for this post');
    }

    return analytics;
  }

  async getPerformanceMetrics(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: { userId, status: 'POSTED' },
      include: { analytics: true, content: true },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    return posts.map((post) => {
      const latestAnalytics = post.analytics[0];
      return {
        postId: post.id,
        contentTitle: post.content.title,
        platform: post.platform,
        publishedAt: post.publishedAt,
        metrics: latestAnalytics || {
          impressions: 0,
          reach: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
      };
    });
  }

  async syncAnalytics(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: { userId, status: 'POSTED' },
    });

    for (const post of posts) {
      await this.prisma.analytics.create({
        data: {
          postId: post.id,
          platform: post.platform,
          impressions: Math.floor(Math.random() * 10000),
          reach: Math.floor(Math.random() * 8000),
          likes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          saves: Math.floor(Math.random() * 30),
          clicks: Math.floor(Math.random() * 200),
          watchHours: Math.random() * 100,
          subscriberDelta: Math.floor(Math.random() * 20),
        },
      });
    }

    return { synced: posts.length };
  }
}
