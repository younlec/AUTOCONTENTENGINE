import { Logger } from '@nestjs/common';
import { PlatformAdapter, PublishResult } from './base-adapter';

export class FacebookAdapter implements PlatformAdapter {
  private readonly logger = new Logger(FacebookAdapter.name);

  async publish(
    _content: string,
    _accessToken: string,
    _metadata?: any,
  ): Promise<PublishResult> {
    this.logger.log('Publishing to Facebook (mock)');
    return {
      success: true,
      platformPostId: `fb_${Date.now()}`,
      url: `https://facebook.com/posts/mock_${Date.now()}`,
    };
  }
}
