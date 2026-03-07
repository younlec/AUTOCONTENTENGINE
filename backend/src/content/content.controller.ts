import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ContentStatus } from '@prisma/client';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('content')
@ApiBearerAuth()
@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateContentDto) {
    return this.contentService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List content with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ContentStatus })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'platform', required: false })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ContentStatus,
    @Query('type') type?: string,
    @Query('platform') platform?: string,
  ) {
    return this.contentService.findAll(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      { status, type, platform },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  findOne(@Param('id') id: string) {
    return this.contentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update content status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.contentService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
