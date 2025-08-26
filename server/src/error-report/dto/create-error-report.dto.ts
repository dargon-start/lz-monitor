import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DeviceInfoDto {
  @ApiProperty({ description: '浏览器版本' })
  @IsString()
  browserVersion: string | number;

  @ApiProperty({ description: '浏览器名称' })
  @IsString()
  browser: string;

  @ApiProperty({ description: '操作系统版本' })
  @IsString()
  osVersion: string | number;

  @ApiProperty({ description: '操作系统名称' })
  @IsString()
  os: string;

  @ApiProperty({ description: 'User Agent' })
  @IsString()
  ua: string;

  @ApiProperty({ description: '设备型号' })
  @IsString()
  device: string;

  @ApiProperty({ description: '设备类型' })
  @IsString()
  device_type: string;
}

export class BreadcrumbItemDto {
  @ApiProperty({ description: '事件类型' })
  @IsString()
  type: string;

  @ApiProperty({ description: '行为分类' })
  @IsString()
  category: string;

  @ApiProperty({ description: '状态' })
  @IsString()
  status: string;

  @ApiProperty({ description: '时间戳' })
  @IsNumber()
  time: number;

  @ApiProperty({ description: '数据内容' })
  data: any;
}

export class CreateErrorReportDto {
  @ApiProperty({ description: '事件类型', example: 'error' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: '项目API密钥' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({ description: '页面唯一标识' })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ description: '用户ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: '页面URL' })
  @IsString()
  @IsNotEmpty()
  pageUrl: string;

  @ApiProperty({ description: '事件发生时间戳' })
  @IsNumber()
  @IsNotEmpty()
  time: number;

  @ApiProperty({ description: '事件状态' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'SDK版本' })
  @IsString()
  @IsNotEmpty()
  sdkVersion: string;

  // HTTP 相关字段
  @ApiProperty({ description: 'HTTP方法', required: false })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiProperty({ description: '请求URL', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: '请求耗时(毫秒)', required: false })
  @IsNumber()
  @IsOptional()
  elapsedTime?: number;

  @ApiProperty({ description: '错误信息或接口信息', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'HTTP状态码', required: false })
  @IsNumber()
  @IsOptional()
  httpStatus?: number;

  @ApiProperty({ description: '请求数据', required: false })
  @IsObject()
  @IsOptional()
  requestData?: Record<string, any>;

  @ApiProperty({ description: '响应数据', required: false })
  @IsObject()
  @IsOptional()
  responseData?: Record<string, any>;

  // 错误相关字段
  @ApiProperty({ description: '错误行号', required: false })
  @IsNumber()
  @IsOptional()
  line?: number;

  @ApiProperty({ description: '错误列号', required: false })
  @IsNumber()
  @IsOptional()
  column?: number;

  @ApiProperty({ description: '错误文件名', required: false })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({ description: '资源名称或错误名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  // 性能相关字段
  @ApiProperty({ description: '性能指标值', required: false })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ description: '性能评级', required: false })
  @IsString()
  @IsOptional()
  rating?: string;

  @ApiProperty({ description: '内存使用情况', required: false })
  @IsObject()
  @IsOptional()
  memory?: Record<string, any>;

  @ApiProperty({ description: '长任务详情', required: false })
  @IsObject()
  @IsOptional()
  longTask?: Record<string, any>;

  // 录屏相关字段
  @ApiProperty({ description: '录屏ID', required: false })
  @IsString()
  @IsOptional()
  recordScreenId?: string;

  @ApiProperty({ description: '录屏事件数据', required: false })
  @IsString()
  @IsOptional()
  events?: string;

  @ApiProperty({ description: '设备信息', required: false })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;

  @ApiProperty({ description: '用户行为栈', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreadcrumbItemDto)
  @IsOptional()
  breadcrumb?: BreadcrumbItemDto[];

  @ApiProperty({ description: '扩展数据', required: false })
  @IsObject()
  @IsOptional()
  extraData?: Record<string, any>;
}
