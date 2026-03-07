import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PublishResult } from './adapters/base-adapter';
import { InstagramAdapter } from './adapters/instagram-adapter';
import { FacebookAdapter } from './adapters/facebook-adapter';
import { TwitterAdapter } from './adapters/twitter-adapter';
import { YoutubeAdapter } from './adapters/youtube-adapter';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);
  private readonly instagramAdapter = new InstagramAdapter();
  private readonly facebookAdapter = new FacebookAdapter();
  private readonly twitterAdapter = new TwitterAdapter();
  private readonly youtubeAdapter = new YoutubeAdapter();

  constructor(private readonly prisma: PrismaService) {}

  async publishPost(postId: string): Promise<PublishResult> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { content: true, connectedAccount: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'PUBLISHING' },
    });

    try {
      const result = await this.publishToPlatform(
        post.platform,
        post.content.body,
        post.connectedAccount.accessToken,
      );

      if (result.success) {
        await this.prisma.post.update({
          where: { id: postId },
          data: {
            status: 'POSTED',
            platformPostId: result.platformPostId,
            publishedAt: new Date(),
          },
        });
      } else {
        await this.prisma.post.update({
          where: { id: postId },
          data: {
            status: 'FAILED',
            errorMessage: result.error,
          },
        });
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          status: 'FAILED',
          errorMessage,
        },
      });
      throw error;
    }
  }

  private async publishToPlatform(
    platform: Platform,
    content: string,
    accessToken: string,
  ): Promise<PublishResult> {
    switch (platform) {
      case Platform.INSTAGRAM:
        return this.instagramAdapter.publish(content, accessToken);
      case Platform.FACEBOOK:
        return this.facebookAdapter.publish(content, accessToken);
      case Platform.TWITTER:
        return this.twitterAdapter.publish(content, accessToken);
      case Platform.YOUTUBE:
        return this.youtubeAdapter.publish(content, accessToken);
      default:
        return { success: false, error: `Unsupported platform: ${platform}` };
    }
  }
}
