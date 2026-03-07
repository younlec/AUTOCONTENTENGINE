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
var VideoCreationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCreationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VideoCreationService = VideoCreationService_1 = class VideoCreationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(VideoCreationService_1.name);
    }
    async generateVideo(userId, dto) {
        const content = await this.prisma.content.findUnique({
            where: { id: dto.contentId },
        });
        if (!content) {
            throw new common_1.NotFoundException('Content not found');
        }
        const scenes = this.breakdownScenes(content.body);
        const video = await this.prisma.video.create({
            data: {
                contentId: dto.contentId,
                userId,
                scriptText: content.body,
                scenes,
                format: dto.format || 'mp4',
                status: 'PENDING',
            },
        });
        this.logger.log(`Video creation job started for video ${video.id}`);
        setTimeout(async () => {
            try {
                await this.prisma.video.update({
                    where: { id: video.id },
                    data: { status: 'GENERATING' },
                });
                await this.prisma.video.update({
                    where: { id: video.id },
                    data: {
                        status: 'COMPLETED',
                        videoUrl: `https://mock-cdn.example.com/videos/${video.id}.mp4`,
                        thumbnailUrl: `https://mock-cdn.example.com/thumbnails/${video.id}.jpg`,
                        duration: 30.0,
                    },
                });
                this.logger.log(`Video ${video.id} generation completed (mock)`);
            }
            catch (error) {
                this.logger.error(`Video ${video.id} generation failed`, error);
            }
        }, 2000);
        return video;
    }
    async checkStatus(id) {
        const video = await this.prisma.video.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return {
            id: video.id,
            status: video.status,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
        };
    }
    breakdownScenes(scriptText) {
        const lines = scriptText.split('\n').filter((line) => line.trim());
        return lines.map((line, index) => ({
            sceneNumber: index + 1,
            text: line.trim(),
            duration: 3,
            transition: index === 0 ? 'fade-in' : 'cut',
        }));
    }
};
exports.VideoCreationService = VideoCreationService;
exports.VideoCreationService = VideoCreationService = VideoCreationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoCreationService);
//# sourceMappingURL=video-creation.service.js.map