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
var ContentDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContentDiscoveryService = ContentDiscoveryService_1 = class ContentDiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ContentDiscoveryService_1.name);
    }
    async fetchTrendingTopics() {
        this.logger.log('Fetching trending topics...');
        const sampleTopics = [
            {
                title: 'AI Tools for Content Creators in 2024',
                description: 'Explore the latest AI tools that are transforming content creation workflows.',
                source: 'trending-api',
                score: 92.5,
                category: 'Technology',
                metadata: { trending: true, region: 'global' },
            },
            {
                title: 'Short-Form Video Strategies That Drive Engagement',
                description: 'Best practices for creating viral short-form content on TikTok, Reels, and Shorts.',
                source: 'trending-api',
                score: 88.3,
                category: 'Social Media',
                metadata: { trending: true, region: 'global' },
            },
            {
                title: 'Monetization Strategies for Small Creators',
                description: 'How creators with under 10K followers can start generating revenue.',
                source: 'trending-api',
                score: 85.1,
                category: 'Business',
                metadata: { trending: true, region: 'global' },
            },
            {
                title: 'Building a Personal Brand on LinkedIn',
                description: 'Step-by-step guide to establishing authority on LinkedIn.',
                source: 'trending-api',
                score: 79.7,
                category: 'Professional',
                metadata: { trending: true, region: 'global' },
            },
            {
                title: 'SEO in 2024: What Has Changed',
                description: 'Major algorithm updates and their impact on content strategy.',
                source: 'trending-api',
                score: 76.2,
                category: 'Marketing',
                metadata: { trending: true, region: 'global' },
            },
        ];
        const topics = await Promise.all(sampleTopics.map((topic) => this.prisma.topic.create({ data: topic })));
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
    rankTopics(topics) {
        return topics.sort((a, b) => Number(b.score) - Number(a.score));
    }
};
exports.ContentDiscoveryService = ContentDiscoveryService;
exports.ContentDiscoveryService = ContentDiscoveryService = ContentDiscoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentDiscoveryService);
//# sourceMappingURL=content-discovery.service.js.map