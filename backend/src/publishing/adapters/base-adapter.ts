export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  url?: string;
  error?: string;
}

export interface PlatformAdapter {
  publish(
    content: string,
    accessToken: string,
    metadata?: any,
  ): Promise<PublishResult>;
}
