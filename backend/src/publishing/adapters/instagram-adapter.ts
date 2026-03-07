import { Logger } from '@nestjs/common';
import { PlatformAdapter, PublishResult } from './base-adapter';

export class InstagramAdapter implements PlatformAdapter {
  private readonly logger = new Logger(InstagramAdapter.name);

  async publish(
    _content: string,
    _accessToken: string,
    _metadata?: any,
  ): Promise<PublishResult> {
    this.logger.log('Publishing to Instagram (mock)');
    return {
      success: true,
      platformPostId: `ig_${Date.now()}`,
      url: `https://instagram.com/p/mock_${Date.now()}`,
    };
  }
}
