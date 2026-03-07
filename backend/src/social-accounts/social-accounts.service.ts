import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectAccountDto } from './dto/connect-account.dto';

@Injectable()
export class SocialAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async connect(userId: string, dto: ConnectAccountDto) {
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

  async findAllByUser(userId: string) {
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

  async disconnect(userId: string, id: string) {
    const account = await this.prisma.connectedAccount.findFirst({
      where: { id, userId },
    });
    if (!account) {
      throw new NotFoundException('Connected account not found');
    }
    return this.prisma.connectedAccount.delete({ where: { id } });
  }
}
