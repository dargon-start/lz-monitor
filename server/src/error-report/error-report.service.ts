import {
  Injectable,
  BadRequestException,
  Logger,
  Scope,
  Inject,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { MonitorEvent } from './entities/monitor-event.entity';

@Injectable({ scope: Scope.REQUEST })
export class ErrorReportService {
  private readonly logger = new Logger(ErrorReportService.name);

  constructor(
    @InjectRepository(MonitorEvent)
    private readonly monitorEventRepository: Repository<MonitorEvent>,
    @Optional() @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createErrorReportDto: CreateErrorReportDto) {
    try {
      // 获取客户端IP
      const ip = this.getClientIp();

      // 转换数据为实体对象格式
      const entityData = {
        event_type: createErrorReportDto.eventType,
        sub_type: createErrorReportDto.subType,
        app_id: createErrorReportDto.appId,
        user_id: createErrorReportDto.userId,
        session_id: createErrorReportDto.sessionId,
        url: createErrorReportDto.url,
        page_title: createErrorReportDto.pageTitle,
        referrer: createErrorReportDto.referrer,
        timestamp: createErrorReportDto.timestamp,
        device_info: createErrorReportDto.deviceInfo || undefined,
        browser_info: createErrorReportDto.browserInfo || undefined,
        os_info: createErrorReportDto.osInfo || undefined,
        network_info: createErrorReportDto.networkInfo || undefined,
        event_data: createErrorReportDto.eventData,
        ip,
      };

      // 创建监控记录
      const monitorEvent = this.monitorEventRepository.create(entityData);

      // 保存到数据库
      await this.monitorEventRepository.save(monitorEvent);

      return {
        success: true,
        message: '事件上报成功',
      };
    } catch (error) {
      this.logger.error(`事件上报失败: ${error.message}`, error.stack);
      throw new BadRequestException({
        success: false,
        message: '事件上报失败',
        error: error.message,
      });
    }
  }

  async findAll(query: any = {}) {
    const { page = 1, pageSize = 10, app_id, event_type, sub_type } = query;

    // 构建查询条件
    const where: any = {};
    if (app_id) where.app_id = app_id;
    if (event_type) where.event_type = event_type;
    if (sub_type) where.sub_type = sub_type;

    // 查询数据
    const [list, total] = await this.monitorEventRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        timestamp: 'DESC',
      },
    });

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  // 获取客户端真实IP地址
  private getClientIp(): string {
    if (!this.request) {
      return '未知IP';
    }

    // 尝试从各种头部中获取客户端IP
    const ip =
      this.request.headers['x-forwarded-for'] ||
      this.request.headers['x-real-ip'] ||
      this.request.ip ||
      '未知IP';

    // 如果是x-forwarded-for可能有多个IP，取第一个
    if (typeof ip === 'string' && ip.includes(',')) {
      return ip.split(',')[0].trim();
    }

    return ip as string;
  }
}
