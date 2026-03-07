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
import { SocialAccountsService } from './social-accounts.service';
import { ConnectAccountDto } from './dto/connect-account.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('social-accounts')
@ApiBearerAuth()
@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountsController {
  constructor(private readonly socialAccountsService: SocialAccountsService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a social media account' })
  connect(@CurrentUser('id') userId: string, @Body() dto: ConnectAccountDto) {
    return this.socialAccountsService.connect(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List connected accounts' })
  findAll(@CurrentUser('id') userId: string) {
    return this.socialAccountsService.findAllByUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect a social media account' })
  disconnect(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.socialAccountsService.disconnect(userId, id);
  }
}
