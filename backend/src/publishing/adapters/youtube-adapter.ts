import { Logger } from '@nestjs/common';
import { PlatformAdapter, PublishResult } from './base-adapter';

export class YoutubeAdapter implements PlatformAdapter {
  private readonly logger = new Logger(YoutubeAdapter.name);

  async publish(
    _content: string,
    _accessToken: string,
    _metadata?: any,
  ): Promise<PublishResult> {
    this.logger.log('Publishing to YouTube (mock)');
    return {
      success: true,
      platformPostId: `yt_${Date.now()}`,
      url: `https://youtube.com/watch?v=mock_${Date.now()}`,
    };
  }
}
