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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SchedulingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
let SchedulingService = SchedulingService_1 = class SchedulingService {
    constructor(prisma, schedulingQueue) {
        this.prisma = prisma;
        this.schedulingQueue = schedulingQueue;
        this.logger = new common_1.Logger(SchedulingService_1.name);
    }
    async schedulePost(userId, postId, scheduledAt) {
        const post = await this.prisma.post.findFirst({
            where: { id: postId, userId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const delay = new Date(scheduledAt).getTime() - Date.now();
        await this.prisma.post.update({
            where: { id: postId },
            data: {
                status: 'SCHEDULED',
                scheduledAt: new Date(scheduledAt),
            },
        });
        await this.schedulingQueue.add('publish-post', { postId, userId }, { delay: Math.max(delay, 0), jobId: `schedule-${postId}` });
        this.logger.log(`Post ${postId} scheduled for ${scheduledAt}`);
        return { postId, scheduledAt, status: 'SCHEDULED' };
    }
    async cancelScheduledPost(userId, postId) {
        const post = await this.prisma.post.findFirst({
            where: { id: postId, userId, status: 'SCHEDULED' },
        });
        if (!post) {
            throw new common_1.NotFoundException('Scheduled post not found');
        }
        const job = await this.schedulingQueue.getJob(`schedule-${postId}`);
        if (job) {
            await job.remove();
        }
        await this.prisma.post.update({
            where: { id: postId },
            data: { status: 'DRAFT', scheduledAt: null },
        });
        return { postId, status: 'CANCELLED' };
    }
    async getScheduledPosts(userId) {
        return this.prisma.post.findMany({
            where: { userId, status: 'SCHEDULED' },
            include: { content: true },
            orderBy: { scheduledAt: 'asc' },
        });
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = SchedulingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('post-scheduling')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], SchedulingService);
//# sourceMappingURL=scheduling.service.js.map