import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryErrorReportDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页条数', required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number = 20;

  @ApiProperty({ description: '项目API密钥', required: false })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ description: '事件类型', required: false, example: 'error' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '页面唯一标识', required: false })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiProperty({ description: '用户ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: '事件状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '页面URL关键字', required: false })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiProperty({ description: '开始时间戳', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  startTime?: number;

  @ApiProperty({ description: '结束时间戳', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  endTime?: number;

  @ApiProperty({ description: 'HTTP状态码', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  httpStatus?: number;

  @ApiProperty({ description: '错误文件名', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: '浏览器类型', required: false })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiProperty({ description: '操作系统', required: false })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiProperty({ description: '设备类型', required: false })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiProperty({
    description: '事件类型列表',
    required: false,
    type: [String],
    example: ['error', 'xhr', 'performance'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @ApiProperty({ description: '排序字段', required: false, default: 'time' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'time';

  @ApiProperty({
    description: '排序方向',
    required: false,
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ description: '错误信息关键字', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
