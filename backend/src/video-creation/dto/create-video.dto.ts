import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  contentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  format?: string;
}
