import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

const VALID_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: [ContentStatus.REVIEW],
  REVIEW: [ContentStatus.APPROVED, ContentStatus.DRAFT],
  APPROVED: [ContentStatus.SCHEDULED],
  SCHEDULED: [ContentStatus.POSTED, ContentStatus.APPROVED],
  POSTED: [],
  FAILED: [ContentStatus.DRAFT],
};

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateContentDto) {
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

  async findAll(
    userId: string,
    page = 1,
    limit = 20,
    filters?: { status?: ContentStatus; type?: string; platform?: string },
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.platform) where.platform = filters.platform;

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

  async findById(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { topic: true, videos: true, posts: true },
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async update(id: string, dto: UpdateContentDto) {
    await this.findById(id);
    return this.prisma.content.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, newStatus: ContentStatus) {
    const content = await this.findById(id);
    const validNext = VALID_TRANSITIONS[content.status];

    if (!validNext?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${content.status} to ${newStatus}`,
      );
    }

    return this.prisma.content.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.content.delete({ where: { id } });
  }
}
