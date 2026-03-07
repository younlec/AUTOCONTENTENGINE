import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  getOverview(@CurrentUser('id') userId: string) {
    return this.analyticsService.getOverview(userId);
  }

  @Get('posts/:postId')
  @ApiOperation({ summary: 'Get analytics for a specific post' })
  getPostAnalytics(@Param('postId') postId: string) {
    return this.analyticsService.getPostAnalytics(postId);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  getPerformanceMetrics(@CurrentUser('id') userId: string) {
    return this.analyticsService.getPerformanceMetrics(userId);
  }
}
