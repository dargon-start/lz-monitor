import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMonitorWhiteScreenDto {
  @ApiProperty({ description: '项目API密钥' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({ description: '状态：ok/error' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: '空白采样点数量', required: false })
  @IsNumber()
  @IsOptional()
  emptyPoints?: number;

  @ApiProperty({ description: '骨架屏数据', required: false })
  @IsObject()
  @IsOptional()
  skeletonData?: Record<string, any>;

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
