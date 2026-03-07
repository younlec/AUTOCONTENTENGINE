import { Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ContentDiscoveryService } from './content-discovery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('content-discovery')
@ApiBearerAuth()
@Controller('content-discovery')
@UseGuards(JwtAuthGuard)
export class ContentDiscoveryController {
  constructor(
    private readonly contentDiscoveryService: ContentDiscoveryService,
  ) {}

  @Post('fetch')
  @ApiOperation({ summary: 'Fetch trending topics' })
  fetchTrendingTopics() {
    return this.contentDiscoveryService.fetchTrendingTopics();
  }

  @Get('topics')
  @ApiOperation({ summary: 'List discovered topics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTopics(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.contentDiscoveryService.getTopics(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
