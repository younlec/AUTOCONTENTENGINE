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
exports.SocialAccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SocialAccountsService = class SocialAccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async connect(userId, dto) {
        return this.prisma.connectedAccount.upsert({
            where: {
                userId_platform_platformUserId: {
                    userId,
                    platform: dto.platform,
                    platformUserId: dto.platformUserId,
                },
            },
            update: {
                accessToken: dto.accessToken,
                refreshToken: dto.refreshToken,
            },
            create: {
                userId,
                platform: dto.platform,
                platformUserId: dto.platformUserId,
                accessToken: dto.accessToken,
                refreshToken: dto.refreshToken,
            },
        });
    }
    async findAllByUser(userId) {
        return this.prisma.connectedAccount.findMany({
            where: { userId },
            select: {
                id: true,
                platform: true,
                platformUserId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async disconnect(userId, id) {
        const account = await this.prisma.connectedAccount.findFirst({
            where: { id, userId },
        });
        if (!account) {
            throw new common_1.NotFoundException('Connected account not found');
        }
        return this.prisma.connectedAccount.delete({ where: { id } });
    }
};
exports.SocialAccountsService = SocialAccountsService;
exports.SocialAccountsService = SocialAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialAccountsService);
//# sourceMappingURL=social-accounts.service.js.map