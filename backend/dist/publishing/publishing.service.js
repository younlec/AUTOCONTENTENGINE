"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PublishingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const instagram_adapter_1 = require("./adapters/instagram-adapter");
const facebook_adapter_1 = require("./adapters/facebook-adapter");
const twitter_adapter_1 = require("./adapters/twitter-adapter");
const youtube_adapter_1 = require("./adapters/youtube-adapter");
let PublishingService = PublishingService_1 = class PublishingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PublishingService_1.name);
        this.instagramAdapter = new instagram_adapter_1.InstagramAdapter();
        this.facebookAdapter = new facebook_adapter_1.FacebookAdapter();
        this.twitterAdapter = new twitter_adapter_1.TwitterAdapter();
        this.youtubeAdapter = new youtube_adapter_1.YoutubeAdapter();
    }
    async publishPost(postId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: { content: true, connectedAccount: true },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.prisma.post.update({
            where: { id: postId },
            data: { status: 'PUBLISHING' },
        });
        try {
            const result = await this.publishToPlatform(post.platform, post.content.body, post.connectedAccount.accessToken);
            if (result.success) {
                await this.prisma.post.update({
                    where: { id: postId },
                    data: {
                        status: 'POSTED',
                        platformPostId: result.platformPostId,
                        publishedAt: new Date(),
                    },
                });
            }
            else {
                await this.prisma.post.update({
                    where: { id: postId },
                    data: {
                        status: 'FAILED',
                        errorMessage: result.error,
                    },
                });
            }
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    async publishToPlatform(platform, content, accessToken) {
        switch (platform) {
            case client_1.Platform.INSTAGRAM:
                return this.instagramAdapter.publish(content, accessToken);
            case client_1.Platform.FACEBOOK:
                return this.facebookAdapter.publish(content, accessToken);
            case client_1.Platform.TWITTER:
                return this.twitterAdapter.publish(content, accessToken);
            case client_1.Platform.YOUTUBE:
                return this.youtubeAdapter.publish(content, accessToken);
            default:
                return { success: false, error: `Unsupported platform: ${platform}` };
        }
    }
};
exports.PublishingService = PublishingService;
exports.PublishingService = PublishingService = PublishingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublishingService);
//# sourceMappingURL=publishing.service.js.map