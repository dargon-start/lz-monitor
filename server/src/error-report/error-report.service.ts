import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Optional,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
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

      // 直接使用小驼峰字段名，TypeORM会自动映射到数据库字段
      const entityData = {
        ...createErrorReportDto,
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
    const {
      page = 1,
      pageSize = 20,
      apiKey,
      type,
      status,
      userId,
      pageUrl,
      startTime,
      endTime,
      httpStatus,
      fileName,
      browser,
      os,
      deviceType,
      types,
      sortBy = 'time',
      sortOrder = 'DESC',
      message,
    } = query;

    const queryBuilder =
      this.monitorEventRepository.createQueryBuilder('event');

    // 基本条件过滤（直接使用小驼峰字段名）
    if (apiKey) {
      queryBuilder.andWhere('event.apiKey = :apiKey', { apiKey });
    }

    if (type) {
      queryBuilder.andWhere('event.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    }

    if (userId) {
      queryBuilder.andWhere('event.userId = :userId', { userId });
    }

    if (pageUrl) {
      queryBuilder.andWhere('event.pageUrl LIKE :pageUrl', {
        pageUrl: `%${pageUrl}%`,
      });
    }

    if (types && types.length > 0) {
      queryBuilder.andWhere('event.type IN (:...types)', { types });
    }

    if (message) {
      queryBuilder.andWhere('event.message LIKE :message', {
        message: `%${message}%`,
      });
    }

    // 时间范围过滤
    if (startTime && endTime) {
      queryBuilder.andWhere('event.time BETWEEN :start_time AND :end_time', {
        start_time: startTime,
        end_time: endTime,
      });
    } else if (startTime) {
      queryBuilder.andWhere('event.time >= :start_time', {
        start_time: startTime,
      });
    } else if (endTime) {
      queryBuilder.andWhere('event.time <= :end_time', { end_time: endTime });
    }

    // HTTP 状态码过滤
    if (httpStatus) {
      queryBuilder.andWhere('event.httpStatus = :httpStatus', {
        httpStatus,
      });
    }

    // 文件名过滤
    if (fileName) {
      queryBuilder.andWhere('event.fileName LIKE :fileName', {
        fileName: `%${fileName}%`,
      });
    }

    // 设备信息过滤
    if (browser) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(event.device_info, '$.browser') = :browser",
        {
          browser,
        },
      );
    }

    if (os) {
      queryBuilder.andWhere("JSON_EXTRACT(event.device_info, '$.os') = :os", {
        os,
      });
    }

    if (deviceType) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(event.device_info, '$.device_type') = :device_type",
        {
          device_type: deviceType,
        },
      );
    }

    // 排序
    queryBuilder.orderBy(`event.${sortBy}`, sortOrder);

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    // 不需要转换，直接返回小驼峰格式的数据
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
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
