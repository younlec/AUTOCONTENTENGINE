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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(userId) {
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
    async getPostAnalytics(postId) {
        const analytics = await this.prisma.analytics.findMany({
            where: { postId },
            orderBy: { createdAt: 'desc' },
        });
        if (analytics.length === 0) {
            throw new common_1.NotFoundException('No analytics found for this post');
        }
        return analytics;
    }
    async getPerformanceMetrics(userId) {
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
    async syncAnalytics(userId) {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map