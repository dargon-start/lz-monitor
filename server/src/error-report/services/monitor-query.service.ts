import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MonitorError,
  MonitorHttpRequest,
  MonitorPerformance,
  MonitorSession,
  MonitorWhiteScreen,
} from '../entities';

/**
 * 监控数据查询服务
 */
@Injectable()
export class MonitorQueryService {
  private readonly logger = new Logger(MonitorQueryService.name);

  constructor(
    @InjectRepository(MonitorError)
    private readonly monitorErrorRepository: Repository<MonitorError>,
    @InjectRepository(MonitorHttpRequest)
    private readonly monitorHttpRequestRepository: Repository<MonitorHttpRequest>,
    @InjectRepository(MonitorPerformance)
    private readonly monitorPerformanceRepository: Repository<MonitorPerformance>,
    @InjectRepository(MonitorWhiteScreen)
    private readonly monitorWhiteScreenRepository: Repository<MonitorWhiteScreen>,
    @InjectRepository(MonitorSession)
    private readonly monitorSessionRepository: Repository<MonitorSession>,
  ) {}

  /**
   * 查询错误列表
   */
  async findErrors(query: any = {}) {
    const {
      page = 1,
      pageSize = 20,
      apiKey,
      errorType,
      userId,
      pageUrl,
      startTime,
      endTime,
      fileName,
      browser,
      os,
      deviceType,
      sortBy = 'time',
      sortOrder = 'DESC',
      message,
    } = query;

    const queryBuilder =
      this.monitorErrorRepository.createQueryBuilder('error');

    // 条件过滤
    if (apiKey) {
      queryBuilder.andWhere('error.apiKey = :apiKey', { apiKey });
    }
    if (errorType) {
      queryBuilder.andWhere('error.errorType = :errorType', { errorType });
    }
    if (userId) {
      queryBuilder.andWhere('error.userId = :userId', { userId });
    }
    if (pageUrl) {
      queryBuilder.andWhere('error.pageUrl LIKE :pageUrl', {
        pageUrl: `%${pageUrl}%`,
      });
    }
    if (message) {
      queryBuilder.andWhere('error.message LIKE :message', {
        message: `%${message}%`,
      });
    }
    if (fileName) {
      queryBuilder.andWhere('error.fileName LIKE :fileName', {
        fileName: `%${fileName}%`,
      });
    }
    if (browser) {
      queryBuilder.andWhere('error.browser = :browser', { browser });
    }
    if (os) {
      queryBuilder.andWhere('error.os = :os', { os });
    }
    if (deviceType) {
      queryBuilder.andWhere('error.deviceType = :deviceType', { deviceType });
    }

    // 时间范围
    if (startTime && endTime) {
      queryBuilder.andWhere('error.time BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    } else if (startTime) {
      queryBuilder.andWhere('error.time >= :startTime', { startTime });
    } else if (endTime) {
      queryBuilder.andWhere('error.time <= :endTime', { endTime });
    }

    // 排序
    queryBuilder.orderBy(`error.${sortBy}`, sortOrder);

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 根据ID查询单条错误
   */
  async findErrorById(id: number): Promise<MonitorError | null> {
    if (!id) return null;
    return await this.monitorErrorRepository.findOne({ where: { id } });
  }

  /**
   * 查询HTTP请求列表
   */
  async findHttpRequests(query: any = {}) {
    const {
      page = 1,
      pageSize = 20,
      apiKey,
      requestType,
      status,
      method,
      httpStatus,
      userId,
      startTime,
      endTime,
      sortBy = 'time',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder =
      this.monitorHttpRequestRepository.createQueryBuilder('http');

    if (apiKey) {
      queryBuilder.andWhere('http.apiKey = :apiKey', { apiKey });
    }
    if (requestType) {
      queryBuilder.andWhere('http.requestType = :requestType', { requestType });
    }
    if (status) {
      queryBuilder.andWhere('http.status = :status', { status });
    }
    if (method) {
      queryBuilder.andWhere('http.method = :method', { method });
    }
    if (httpStatus) {
      queryBuilder.andWhere('http.httpStatus = :httpStatus', { httpStatus });
    }
    if (userId) {
      queryBuilder.andWhere('http.userId = :userId', { userId });
    }

    if (startTime && endTime) {
      queryBuilder.andWhere('http.time BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }

    queryBuilder.orderBy(`http.${sortBy}`, sortOrder);
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 查询性能指标
   */
  async findPerformance(query: any = {}) {
    const {
      page = 1,
      pageSize = 20,
      apiKey,
      metricName,
      rating,
      startTime,
      endTime,
    } = query;

    const queryBuilder =
      this.monitorPerformanceRepository.createQueryBuilder('perf');

    if (apiKey) {
      queryBuilder.andWhere('perf.apiKey = :apiKey', { apiKey });
    }
    if (metricName) {
      queryBuilder.andWhere('perf.metricName = :metricName', { metricName });
    }
    if (rating) {
      queryBuilder.andWhere('perf.rating = :rating', { rating });
    }
    if (startTime && endTime) {
      queryBuilder.andWhere('perf.time BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }

    queryBuilder.orderBy('perf.time', 'DESC');
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 查询会话列表
   */
  async findSessions(query: any = {}) {
    const {
      page = 1,
      pageSize = 20,
      apiKey,
      userId,
      startTime,
      endTime,
      hasError,
    } = query;

    const queryBuilder =
      this.monitorSessionRepository.createQueryBuilder('session');

    if (apiKey) {
      queryBuilder.andWhere('session.apiKey = :apiKey', { apiKey });
    }
    if (userId) {
      queryBuilder.andWhere('session.userId = :userId', { userId });
    }
    if (hasError !== undefined) {
      if (hasError) {
        queryBuilder.andWhere(
          'session.errorCount > 0 OR session.httpErrorCount > 0',
        );
      } else {
        queryBuilder.andWhere(
          'session.errorCount = 0 AND session.httpErrorCount = 0',
        );
      }
    }
    if (startTime && endTime) {
      queryBuilder.andWhere(
        'session.firstSeenAt BETWEEN :startTime AND :endTime',
        {
          startTime,
          endTime,
        },
      );
    }

    queryBuilder.orderBy('session.firstSeenAt', 'DESC');
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取统计概览
   */
  async getStatisticsOverview(
    apiKey: string,
    startTime?: number,
    endTime?: number,
  ) {
    const timeCondition =
      startTime && endTime ? 'AND time BETWEEN :startTime AND :endTime' : '';
    const params: any = { apiKey };
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    // 错误统计
    const errorStats = await this.monitorErrorRepository
      .createQueryBuilder('error')
      .select('error.errorType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(`error.apiKey = :apiKey ${timeCondition}`, params)
      .groupBy('error.errorType')
      .getRawMany();

    // HTTP统计
    const httpStats = await this.monitorHttpRequestRepository
      .createQueryBuilder('http')
      .select('http.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(http.elapsedTime)', 'avgTime')
      .where(`http.apiKey = :apiKey ${timeCondition}`, params)
      .groupBy('http.status')
      .getRawMany();

    // 性能统计
    const perfStats = await this.monitorPerformanceRepository
      .createQueryBuilder('perf')
      .select('perf.metricName', 'metric')
      .addSelect('AVG(perf.value)', 'avgValue')
      .where(`perf.apiKey = :apiKey ${timeCondition}`, params)
      .groupBy('perf.metricName')
      .getRawMany();

    // 会话统计
    const sessionStats = await this.monitorSessionRepository
      .createQueryBuilder('session')
      .select('COUNT(*)', 'totalSessions')
      .addSelect('COUNT(DISTINCT session.userId)', 'uniqueUsers')
      .addSelect('SUM(session.pageViews)', 'totalPV')
      .addSelect('SUM(session.errorCount)', 'totalErrors')
      .where(
        `session.apiKey = :apiKey ${timeCondition.replace('time', 'firstSeenAt')}`,
        params,
      )
      .getRawOne();

    return {
      errors: errorStats,
      http: httpStats,
      performance: perfStats,
      sessions: sessionStats,
    };
  }
}
