import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class SchedulePostDto {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsDateString()
  scheduledAt: string;
}

@ApiTags('scheduling')
@ApiBearerAuth()
@Controller('scheduling')
@UseGuards(JwtAuthGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule a post for publishing' })
  schedule(@CurrentUser('id') userId: string, @Body() dto: SchedulePostDto) {
    return this.schedulingService.schedulePost(
      userId,
      dto.postId,
      new Date(dto.scheduledAt),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a scheduled post' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.schedulingService.cancelScheduledPost(userId, id);
  }

  @Get()
  @ApiOperation({ summary: 'List scheduled posts' })
  findAll(@CurrentUser('id') userId: string) {
    return this.schedulingService.getScheduledPosts(userId);
  }
}
