import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentDiscoveryService {
  private readonly logger = new Logger(ContentDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchTrendingTopics() {
    this.logger.log('Fetching trending topics...');

    const sampleTopics = [
      {
        title: 'AI Tools for Content Creators in 2024',
        description:
          'Explore the latest AI tools that are transforming content creation workflows.',
        source: 'trending-api',
        score: 92.5,
        category: 'Technology',
        metadata: { trending: true, region: 'global' },
      },
      {
        title: 'Short-Form Video Strategies That Drive Engagement',
        description:
          'Best practices for creating viral short-form content on TikTok, Reels, and Shorts.',
        source: 'trending-api',
        score: 88.3,
        category: 'Social Media',
        metadata: { trending: true, region: 'global' },
      },
      {
        title: 'Monetization Strategies for Small Creators',
        description:
          'How creators with under 10K followers can start generating revenue.',
        source: 'trending-api',
        score: 85.1,
        category: 'Business',
        metadata: { trending: true, region: 'global' },
      },
      {
        title: 'Building a Personal Brand on LinkedIn',
        description:
          'Step-by-step guide to establishing authority on LinkedIn.',
        source: 'trending-api',
        score: 79.7,
        category: 'Professional',
        metadata: { trending: true, region: 'global' },
      },
      {
        title: 'SEO in 2024: What Has Changed',
        description:
          'Major algorithm updates and their impact on content strategy.',
        source: 'trending-api',
        score: 76.2,
        category: 'Marketing',
        metadata: { trending: true, region: 'global' },
      },
    ];

    const topics = await Promise.all(
      sampleTopics.map((topic) => this.prisma.topic.create({ data: topic })),
    );

    return topics;
  }

  async getTopics(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [topics, total] = await Promise.all([
      this.prisma.topic.findMany({
        skip,
        take: limit,
        orderBy: { score: 'desc' },
      }),
      this.prisma.topic.count(),
    ]);

    return {
      data: topics,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  rankTopics(
    topics: { score: Float64Array | number; category?: string | null }[],
  ) {
    return topics.sort((a, b) => Number(b.score) - Number(a.score));
  }
}
