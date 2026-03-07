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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const VALID_TRANSITIONS = {
    DRAFT: [client_1.ContentStatus.REVIEW],
    REVIEW: [client_1.ContentStatus.APPROVED, client_1.ContentStatus.DRAFT],
    APPROVED: [client_1.ContentStatus.SCHEDULED],
    SCHEDULED: [client_1.ContentStatus.POSTED, client_1.ContentStatus.APPROVED],
    POSTED: [],
    FAILED: [client_1.ContentStatus.DRAFT],
};
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.content.create({
            data: {
                userId,
                topicId: dto.topicId,
                type: dto.type,
                title: dto.title,
                body: dto.body,
                platform: dto.platform,
            },
        });
    }
    async findAll(userId, page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.platform)
            where.platform = filters.platform;
        const [data, total] = await Promise.all([
            this.prisma.content.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { topic: true },
            }),
            this.prisma.content.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findById(id) {
        const content = await this.prisma.content.findUnique({
            where: { id },
            include: { topic: true, videos: true, posts: true },
        });
        if (!content) {
            throw new common_1.NotFoundException('Content not found');
        }
        return content;
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.content.update({
            where: { id },
            data: dto,
        });
    }
    async updateStatus(id, newStatus) {
        const content = await this.findById(id);
        const validNext = VALID_TRANSITIONS[content.status];
        if (!validNext?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Cannot transition from ${content.status} to ${newStatus}`);
        }
        return this.prisma.content.update({
            where: { id },
            data: { status: newStatus },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.content.delete({ where: { id } });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map