import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VideoCreationService } from './video-creation.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('video-creation')
@ApiBearerAuth()
@Controller('video-creation')
@UseGuards(JwtAuthGuard)
export class VideoCreationController {
  constructor(private readonly videoCreationService: VideoCreationService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a video from content' })
  generate(@CurrentUser('id') userId: string, @Body() dto: CreateVideoDto) {
    return this.videoCreationService.generateVideo(userId, dto);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Check video generation status' })
  checkStatus(@Param('id') id: string) {
    return this.videoCreationService.checkStatus(id);
  }
}
