import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMonitorHttpRequestDto {
  @ApiProperty({ description: '项目API密钥' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({ description: '请求类型', example: 'xhr' })
  @IsString()
  @IsNotEmpty()
  type: string; // xhr/fetch

  @ApiProperty({ description: 'HTTP方法' })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiProperty({ description: '请求URL' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'HTTP状态码', required: false })
  @IsNumber()
  @IsOptional()
  httpStatus?: number;

  @ApiProperty({ description: '状态：ok/error' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: '请求耗时(毫秒)', required: false })
  @IsNumber()
  @IsOptional()
  elapsedTime?: number;

  @ApiProperty({ description: '请求数据', required: false })
  @IsObject()
  @IsOptional()
  requestData?: Record<string, any>;

  @ApiProperty({ description: '响应数据', required: false })
  @IsObject()
  @IsOptional()
  response?: Record<string, any>;

  @ApiProperty({ description: '错误信息', required: false })
  @IsString()
  @IsOptional()
  message?: string;

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
