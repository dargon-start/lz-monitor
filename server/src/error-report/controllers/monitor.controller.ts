import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Optional,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateMonitorEventDto } from '../dto/create-monitor-event.dto';
import { MonitorDataService } from '../services/monitor-data.service';
import { MonitorQueryService } from '../services/monitor-query.service';

@Controller('monitor')
@ApiTags('监控数据管理')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

  constructor(
    private readonly monitorDataService: MonitorDataService,
    private readonly monitorQueryService: MonitorQueryService,
    @Optional() @Inject(REQUEST) private readonly request: Request,
  ) {}

  /**
   * 统一的监控事件上报接口
   */
  @Post('report')
  @ApiOperation({ summary: '上报监控事件（新版多表存储）' })
  @ApiResponse({ status: 200, description: '事件上报成功' })
  @ApiBody({ type: CreateMonitorEventDto })
  async report(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: false,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )
    dto: CreateMonitorEventDto,
  ) {
    try {
      // 调试：打印接收到的完整数据
      this.logger.debug(`接收到上报数据: ${JSON.stringify(dto)}`);

      // 字段映射：兼容旧版SDK
      const normalizedDto = this.normalizeDto(dto);

      const ip = this.getClientIp();
      await this.monitorDataService.saveMonitorEvent(normalizedDto, ip);

      return {
        success: true,
        message: '事件上报成功',
      };
    } catch (error) {
      this.logger.error(`事件上报失败: ${error.message}`, error.stack);
      return {
        success: false,
        message: '事件上报失败',
        error: error.message,
      };
    }
  }

  /**
   * 字段映射：统一旧版和新版SDK的字段名
   */
  private normalizeDto(dto: CreateMonitorEventDto): CreateMonitorEventDto {
    // 兼容旧版字段名
    if (dto.appId && !dto.apiKey) {
      dto.apiKey = dto.appId;
    }
    if (dto.sessionId && !dto.uuid) {
      dto.uuid = dto.sessionId;
    }
    if (dto.timestamp && !dto.time) {
      dto.time = dto.timestamp;
    }

    // 验证必填字段
    if (!dto.apiKey) {
      throw new Error('apiKey or appId is required');
    }
    if (!dto.uuid) {
      throw new Error('uuid or sessionId is required');
    }
    if (!dto.time) {
      throw new Error('time or timestamp is required');
    }

    // 设置默认值
    if (!dto.status) {
      dto.status = 'ok';
    }
    if (!dto.sdkVersion) {
      dto.sdkVersion = 'unknown';
    }
    if (!dto.pageUrl) {
      dto.pageUrl = 'unknown';
    }

    return dto;
  }

  /**
   * 查询错误列表
   */
  @Get('errors')
  @ApiOperation({ summary: '查询错误列表' })
  async findErrors(@Query() query: any) {
    return this.monitorQueryService.findErrors(query);
  }

  /**
   * 查询HTTP请求列表
   */
  @Get('http-requests')
  @ApiOperation({ summary: '查询HTTP请求列表' })
  async findHttpRequests(@Query() query: any) {
    return this.monitorQueryService.findHttpRequests(query);
  }

  /**
   * 查询性能指标
   */
  @Get('performance')
  @ApiOperation({ summary: '查询性能指标' })
  async findPerformance(@Query() query: any) {
    return this.monitorQueryService.findPerformance(query);
  }

  /**
   * 查询会话列表
   */
  @Get('sessions')
  @ApiOperation({ summary: '查询会话列表' })
  async findSessions(@Query() query: any) {
    return this.monitorQueryService.findSessions(query);
  }

  /**
   * 获取统计概览
   */
  @Get('statistics')
  @ApiOperation({ summary: '获取统计概览' })
  async getStatistics(@Query() query: any) {
    const { apiKey, startTime, endTime } = query;
    return this.monitorQueryService.getStatisticsOverview(
      apiKey,
      startTime ? Number(startTime) : undefined,
      endTime ? Number(endTime) : undefined,
    );
  }

  /**
   * 获取客户端IP
   */
  private getClientIp(): string {
    if (!this.request) {
      return '未知IP';
    }

    const ip =
      this.request.headers['x-forwarded-for'] ||
      this.request.headers['x-real-ip'] ||
      this.request.ip ||
      '未知IP';

    if (typeof ip === 'string' && ip.includes(',')) {
      return ip.split(',')[0].trim();
    }

    return ip as string;
  }
}
