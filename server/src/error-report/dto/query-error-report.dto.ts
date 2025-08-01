import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryErrorReportDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页条数', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({ description: '应用ID', required: false })
  @IsOptional()
  @IsString()
  appId?: string;

  @ApiProperty({ description: '事件类型', required: false })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiProperty({ description: '子类型', required: false })
  @IsOptional()
  @IsString()
  subType?: string;
}
