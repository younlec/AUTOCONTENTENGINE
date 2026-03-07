import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiGenerationService } from './ai-generation.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('ai-generation')
@ApiBearerAuth()
@Controller('ai-generation')
@UseGuards(JwtAuthGuard)
export class AiGenerationController {
  constructor(private readonly aiGenerationService: AiGenerationService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate content using AI' })
  generate(@CurrentUser('id') userId: string, @Body() dto: GenerateContentDto) {
    return this.aiGenerationService.generateContent(userId, dto);
  }
}
