import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoCreationService {
  private readonly logger = new Logger(VideoCreationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateVideo(userId: string, dto: CreateVideoDto) {
    const content = await this.prisma.content.findUnique({
      where: { id: dto.contentId },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
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
      } catch (error) {
        this.logger.error(`Video ${video.id} generation failed`, error);
      }
    }, 2000);

    return video;
  }

  async checkStatus(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return {
      id: video.id,
      status: video.status,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
    };
  }

  private breakdownScenes(scriptText: string): object[] {
    const lines = scriptText.split('\n').filter((line) => line.trim());
    return lines.map((line, index) => ({
      sceneNumber: index + 1,
      text: line.trim(),
      duration: 3,
      transition: index === 0 ? 'fade-in' : 'cut',
    }));
  }
}
