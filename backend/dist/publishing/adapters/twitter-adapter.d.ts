import { PlatformAdapter, PublishResult } from './base-adapter';
export declare class TwitterAdapter implements PlatformAdapter {
    private readonly logger;
    publish(_content: string, _accessToken: string, _metadata?: any): Promise<PublishResult>;
}
