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
  @IsOptional()
  @ApiProperty({ description: '浏览器版本', required: false })
  browserVersion?: string | number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '浏览器名称', required: false })
  browser?: string;

  @IsOptional()
  @ApiProperty({ description: '操作系统版本', required: false })
  osVersion?: string | number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '操作系统名称', required: false })
  os?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User Agent', required: false })
  ua?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '设备型号', required: false })
  device?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '设备类型', required: false })
  device_type?: string;
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

/**
 * 统一的监控事件上报 DTO
 * 兼容 SDK 上报的所有类型数据
 */
export class CreateMonitorEventDto {
  // 基础信息（必填）
  @ApiProperty({ description: '事件类型', example: 'error' })
  @IsString()
  @IsNotEmpty()
  type: string; // error/xhr/fetch/performance/whiteScreen/behavior等

  @ApiProperty({
    description: '项目API密钥（或旧的appId）',
    required: false,
  })
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiProperty({
    description: '页面唯一标识（或旧的sessionId）',
    required: false,
  })
  @IsString()
  @IsOptional()
  uuid?: string;

  @ApiProperty({ description: '页面URL', required: false })
  @IsString()
  @IsOptional()
  pageUrl?: string;

  @ApiProperty({
    description: '事件发生时间戳（或timestamp）',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  time?: number;

  @ApiProperty({ description: '事件状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'SDK版本', required: false })
  @IsString()
  @IsOptional()
  sdkVersion?: string;

  @ApiProperty({ description: '用户ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  // 兼容旧版SDK字段
  @ApiProperty({ description: '旧版appId（会映射到apiKey）', required: false })
  @IsString()
  @IsOptional()
  appId?: string;

  @ApiProperty({
    description: '旧版sessionId（会映射到uuid）',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({
    description: '旧版timestamp（会映射到time）',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  timestamp?: number;

  // 行为事件相关字段
  @ApiProperty({ description: '事件子类型', required: false })
  @IsString()
  @IsOptional()
  subType?: string;

  @ApiProperty({ description: '事件ID', required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: '目标元素', required: false })
  @IsString()
  @IsOptional()
  target?: string;

  @ApiProperty({ description: '开始时间', required: false })
  @IsNumber()
  @IsOptional()
  startTime?: number;

  @ApiProperty({ description: '元素内部HTML', required: false })
  @IsString()
  @IsOptional()
  innerHtml?: string;

  @ApiProperty({ description: '元素外部HTML', required: false })
  @IsString()
  @IsOptional()
  outerHtml?: string;

  @ApiProperty({ description: '元素宽度', required: false })
  @IsNumber()
  @IsOptional()
  with?: number;

  @ApiProperty({ description: '元素高度', required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: '事件类型（如mousedown）', required: false })
  @IsString()
  @IsOptional()
  eventType?: string;

  @ApiProperty({ description: '事件详细数据', required: false })
  @IsObject()
  @IsOptional()
  eventData?: Record<string, any>;

  // 错误相关字段
  @ApiProperty({ description: '错误信息', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: '错误文件名', required: false })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({ description: '错误行号', required: false })
  @IsNumber()
  @IsOptional()
  line?: number;

  @ApiProperty({ description: '错误列号', required: false })
  @IsNumber()
  @IsOptional()
  column?: number;

  @ApiProperty({ description: '错误堆栈', required: false })
  @IsString()
  @IsOptional()
  stack?: string;

  @ApiProperty({ description: '资源名称或错误名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

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

  @ApiProperty({ description: 'HTTP状态码', required: false })
  @IsNumber()
  @IsOptional()
  Status?: number; // 注意：SDK使用大写的Status

  @ApiProperty({ description: '请求数据', required: false })
  @IsObject()
  @IsOptional()
  requestData?: Record<string, any>;

  @ApiProperty({ description: '响应数据', required: false })
  @IsObject()
  @IsOptional()
  response?: Record<string, any>;

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

  // 白屏检测字段
  @ApiProperty({ description: '空白采样点数量', required: false })
  @IsNumber()
  @IsOptional()
  emptyPoints?: number;

  @ApiProperty({ description: '骨架屏数据', required: false })
  @IsObject()
  @IsOptional()
  skeletonData?: Record<string, any>;

  // 录屏相关字段
  @ApiProperty({ description: '录屏ID', required: false })
  @IsString()
  @IsOptional()
  recordScreenId?: string;

  @ApiProperty({ description: '录屏事件数据', required: false })
  @IsString()
  @IsOptional()
  events?: string;

  // 设备信息
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @ApiProperty({
    description: '设备信息',
    required: false,
    type: () => DeviceInfoDto,
  })
  deviceInfo?: DeviceInfoDto;

  // 用户行为栈
  @ApiProperty({ description: '用户行为栈', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreadcrumbItemDto)
  @IsOptional()
  breadcrumb?: BreadcrumbItemDto[];

  // 扩展数据
  @ApiProperty({ description: '扩展数据', required: false })
  @IsObject()
  @IsOptional()
  extraData?: Record<string, any>;
}
