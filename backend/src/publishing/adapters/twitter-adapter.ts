import { Logger } from '@nestjs/common';
import { PlatformAdapter, PublishResult } from './base-adapter';

export class TwitterAdapter implements PlatformAdapter {
  private readonly logger = new Logger(TwitterAdapter.name);

  async publish(
    _content: string,
    _accessToken: string,
    _metadata?: any,
  ): Promise<PublishResult> {
    this.logger.log('Publishing to Twitter (mock)');
    return {
      success: true,
      platformPostId: `tw_${Date.now()}`,
      url: `https://twitter.com/i/status/mock_${Date.now()}`,
    };
  }
}
