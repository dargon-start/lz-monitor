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
   * 查询错误列表 (统一查询 JS错误、HTTP错误、白屏错误)
   * 注意: TypeORM 的 QueryBuilder 不支持 UNION 操作,因此使用原生 SQL
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

    // 构建参数对象
    const params: any = {};
    const conditions: string[] = [];

    // 公共过滤条件
    if (apiKey) {
      params.apiKey = apiKey;
      conditions.push('api_key = :apiKey');
    }
    if (userId) {
      params.userId = userId;
      conditions.push('user_id = :userId');
    }
    if (pageUrl) {
      params.pageUrl = `%${pageUrl}%`;
      conditions.push('page_url LIKE :pageUrl');
    }
    if (browser) {
      params.browser = browser;
      conditions.push('browser = :browser');
    }
    if (os) {
      params.os = os;
      conditions.push('os = :os');
    }
    if (deviceType) {
      params.deviceType = deviceType;
      conditions.push('device_type = :deviceType');
    }

    // 时间范围条件
    if (startTime && endTime) {
      params.startTime = startTime;
      params.endTime = endTime;
      conditions.push('time BETWEEN :startTime AND :endTime');
    } else if (startTime) {
      params.startTime = startTime;
      conditions.push('time >= :startTime');
    } else if (endTime) {
      params.endTime = endTime;
      conditions.push('time <= :endTime');
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 构建 UNION 查询 (使用数据库实际字段名: snake_case)
    const unionQuery = `
      SELECT 
        id,
        'js_error' as errorSource,
        api_key as apiKey,
        time,
        page_url as pageUrl,
        user_id as userId,
        browser,
        os,
        device_type as deviceType,
        uuid,
        message,
        error_type as errorType,
        file_name as fileName,
        line,
        \`column\`,
        stack,
        name,
        NULL as url,
        NULL as method,
        NULL as httpStatus,
        NULL as elapsedTime,
        NULL as emptyPoints,
        NULL as skeletonData
      FROM monitor_errors
      ${whereClause}
      ${message ? (conditions.length > 0 ? 'AND' : 'WHERE') + ' message LIKE :message' : ''}
      ${fileName ? (conditions.length > 0 || message ? 'AND' : 'WHERE') + ' file_name LIKE :fileName' : ''}
      ${errorType ? (conditions.length > 0 || message || fileName ? 'AND' : 'WHERE') + ' error_type = :errorType' : ''}
      
      UNION ALL
      
      SELECT 
        id,
        'http_error' as errorSource,
        api_key as apiKey,
        time,
        page_url as pageUrl,
        user_id as userId,
        browser,
        os,
        device_type as deviceType,
        uuid,
        message,
        NULL as errorType,
        NULL as fileName,
        NULL as line,
        NULL as \`column\`,
        NULL as stack,
        NULL as name,
        url,
        method,
        http_status as httpStatus,
        elapsed_time as elapsedTime,
        NULL as emptyPoints,
        NULL as skeletonData
      FROM monitor_http_requests
      WHERE status = 'error'
      ${conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : ''}
      ${message ? 'AND message LIKE :message' : ''}
      
      UNION ALL
      
      SELECT 
        id,
        'white_screen' as errorSource,
        api_key as apiKey,
        time,
        page_url as pageUrl,
        user_id as userId,
        browser,
        os,
        device_type as deviceType,
        uuid,
        NULL as message,
        NULL as errorType,
        NULL as fileName,
        NULL as line,
        NULL as \`column\`,
        NULL as stack,
        NULL as name,
        NULL as url,
        NULL as method,
        NULL as httpStatus,
        NULL as elapsedTime,
        empty_points as emptyPoints,
        skeleton_data as skeletonData
      FROM monitor_white_screens
      WHERE status = 'error'
      ${conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : ''}
    `;

    // 添加特定条件的参数
    if (message) {
      params.message = `%${message}%`;
    }
    if (fileName) {
      params.fileName = `%${fileName}%`;
    }
    if (errorType) {
      params.errorType = errorType;
    }

    // 先查询总数
    const countQuery = `SELECT COUNT(*) as total FROM (${unionQuery}) as combined`;
    const countResult = await this.monitorErrorRepository.query(
      countQuery,
      Object.values(params),
    );
    const total = parseInt(countResult[0]?.total || '0');

    // 添加排序和分页
    const validSortBy = ['time', 'id'].includes(sortBy) ? sortBy : 'time';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const skip = (page - 1) * pageSize;

    const finalQuery = `
      SELECT * FROM (${unionQuery}) as combined
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ${pageSize} OFFSET ${skip}
    `;

    const data = await this.monitorErrorRepository.query(
      finalQuery,
      Object.values(params),
    );

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
