import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonetizationService } from './monetization.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateAffiliateLinkApiDto {
  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsString()
  productUrl: string;

  @ApiProperty()
  @IsString()
  affiliateUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  program?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  commission?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentId?: string;
}

@ApiTags('monetization')
@ApiBearerAuth()
@Controller('monetization')
@UseGuards(JwtAuthGuard)
export class MonetizationController {
  constructor(private readonly monetizationService: MonetizationService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get monetization dashboard' })
  getDashboard(@CurrentUser('id') userId: string) {
    return this.monetizationService.getDashboard(userId);
  }

  @Post('affiliate-links')
  @ApiOperation({ summary: 'Create an affiliate link' })
  createAffiliateLink(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAffiliateLinkApiDto,
  ) {
    return this.monetizationService.createAffiliateLink(userId, dto);
  }

  @Get('affiliate-links')
  @ApiOperation({ summary: 'List affiliate links' })
  getAffiliateLinks(@CurrentUser('id') userId: string) {
    return this.monetizationService.getAffiliateLinks(userId);
  }
}
