import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMonitorPerformanceDto {
  @ApiProperty({ description: '项目API密钥' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({ description: '性能指标名称', example: 'FCP' })
  @IsString()
  @IsNotEmpty()
  name: string; // FCP/LCP/FID/CLS/TTFB

  @ApiProperty({ description: '性能指标值' })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ description: '性能评级', required: false })
  @IsString()
  @IsOptional()
  rating?: string; // good/needs-improvement/poor

  // 页面信息
  @ApiProperty({ description: '页面URL' })
  @IsString()
  @IsNotEmpty()
  pageUrl: string;

  @ApiProperty({ description: '页面唯一标识' })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ description: '用户ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  // 设备信息
  @ApiProperty({ description: '设备信息', required: false })
  @IsObject()
  @IsOptional()
  deviceInfo?: {
    browser?: string;
    os?: string;
    device_type?: string;
  };

  // 长任务信息
  @ApiProperty({ description: '长任务详情', required: false })
  @IsObject()
  @IsOptional()
  longTask?: Record<string, any>;

  // 内存信息
  @ApiProperty({ description: '内存使用情况', required: false })
  @IsObject()
  @IsOptional()
  memory?: Record<string, any>;

  // 元信息
  @ApiProperty({ description: 'SDK版本' })
  @IsString()
  @IsNotEmpty()
  sdkVersion: string;

  @ApiProperty({ description: '事件发生时间戳' })
  @IsNumber()
  @IsNotEmpty()
  time: number;
}
