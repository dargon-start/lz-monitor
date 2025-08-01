import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateErrorReportDto {
  @ApiProperty({ description: '事件类型', default: 'error', required: true })
  @IsString()
  @IsNotEmpty()
  eventType: string = 'error';

  @ApiProperty({ description: '错误子类型(js-error/xhr等)', required: true })
  @IsString()
  @IsNotEmpty()
  subType: string;

  @ApiProperty({ description: '应用ID/标识', required: true })
  @IsString()
  @IsNotEmpty()
  appId: string;

  @ApiProperty({ description: '用户ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: '会话ID', required: true })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: '事件发生的URL', required: true })
  url?: string;

  @ApiProperty({ description: '页面标题', required: false })
  @IsString()
  @IsOptional()
  pageTitle?: string;

  @ApiProperty({ description: '来源URL', required: false })
  @IsString()
  @IsOptional()
  referrer?: string;

  @ApiProperty({ description: '事件发生的时间戳', required: true })
  @IsNumber()
  @IsNotEmpty()
  timestamp: number;

  @ApiProperty({
    description: '设备信息',
    required: false,
  })
  @IsObject()
  @IsOptional()
  deviceInfo?: Record<string, any>;

  @ApiProperty({
    description: '浏览器信息',
    required: false,
  })
  @IsObject()
  @IsOptional()
  browserInfo?: Record<string, any>;

  @ApiProperty({
    description: '操作系统信息',
    required: false,
  })
  @IsObject()
  @IsOptional()
  osInfo?: Record<string, any>;

  @ApiProperty({
    description: '网络连接信息',
    required: false,
  })
  @IsObject()
  @IsOptional()
  networkInfo?: Record<string, any>;

  @ApiProperty({ description: '事件详细数据', required: true })
  @IsObject()
  @IsNotEmpty()
  eventData: Record<string, any>;
}
