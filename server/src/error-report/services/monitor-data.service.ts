import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { CreateMonitorEventDto } from '../dto/create-monitor-event.dto';
import {
  MonitorError,
  MonitorHttpRequest,
  MonitorPerformance,
  MonitorSession,
  MonitorWhiteScreen,
} from '../entities';

/**
 * 监控数据服务
 * 负责将上报数据分发到不同的表中存储
 */
@Injectable()
export class MonitorDataService {
  private readonly logger = new Logger(MonitorDataService.name);

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
   * 保存监控事件
   * 根据事件类型分发到不同的表
   */
  async saveMonitorEvent(dto: CreateMonitorEventDto, ip: string): Promise<any> {
    const { type } = dto;

    try {
      // 根据事件类型分发
      switch (type) {
        case 'error':
        case 'unhandledrejection':
        case 'resource':
          return await this.saveError(dto, ip);

        case 'xhr':
        case 'fetch':
          return await this.saveHttpRequest(dto, ip);

        case 'performance':
          return await this.savePerformance(dto, ip);

        case 'whiteScreen':
          return await this.saveWhiteScreen(dto, ip);

        case 'behavior':
          // 行为事件暂不单独存储，仅记录日志
          this.logger.debug(`接收到行为事件: ${dto.subType}`);
          return { type: 'behavior', saved: false };

        default:
          this.logger.warn(`未知的事件类型: ${type}`);
          return null;
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`保存监控事件失败: ${err.message}`, err.stack);
      throw error;
    } finally {
      // 异步更新或创建会话信息（不阻塞主流程）
      this.updateSession(dto, ip).catch((err) => {
        const e = err as Error;
        this.logger.error(`更新会话信息失败: ${e.message}`);
      });
    }
  }

  /**
   * 保存错误信息
   */
  private async saveError(
    dto: CreateMonitorEventDto,
    ip: string,
  ): Promise<MonitorError> {
    // 生成错误哈希用于去重
    const errorHash = this.generateErrorHash(dto);

    // 调试：打印 deviceInfo
    this.logger.debug(`接收到的 deviceInfo: ${JSON.stringify(dto.deviceInfo)}`);

    const errorData = this.monitorErrorRepository.create({
      apiKey: dto.apiKey!,
      errorType: dto.type,
      errorHash,
      message: dto.message,
      fileName: dto.fileName,
      line: dto.line,
      column: dto.column,
      stack: dto.stack,
      name: dto.name,
      pageUrl: dto.pageUrl,
      uuid: dto.uuid!,
      userId: dto.userId,
      browser: dto.deviceInfo?.browser as string,
      browserVersion: String(dto.deviceInfo?.browserVersion || ''),
      os: dto.deviceInfo?.os as string,
      osVersion: String(dto.deviceInfo?.osVersion || ''),
      deviceType: dto.deviceInfo?.device_type as string,
      device: dto.deviceInfo?.device as string,
      ua: dto.deviceInfo?.ua as string,
      breadcrumb: dto.breadcrumb,
      recordScreenId: dto.recordScreenId,
      extraData: dto.extraData,
      ip,
      sdkVersion: dto.sdkVersion,
      status: dto.status,
      time: dto.time!,
    });

    return await this.monitorErrorRepository.save(errorData);
  }

  /**
   * 保存HTTP请求信息
   */
  private async saveHttpRequest(
    dto: CreateMonitorEventDto,
    ip: string,
  ): Promise<MonitorHttpRequest> {
    // 生成URL哈希用于聚合统计
    const urlHash = dto.url
      ? createHash('md5').update(dto.url).digest('hex')
      : undefined;

    const httpData = this.monitorHttpRequestRepository.create({
      apiKey: dto.apiKey!,
      requestType: dto.type,
      method: dto.method,
      url: dto.url,
      urlHash,
      httpStatus: dto.Status, // 注意SDK使用大写Status
      status: dto.status,
      elapsedTime: dto.elapsedTime,
      requestData: dto.requestData,
      responseData: dto.response, // 注意SDK使用response
      message: dto.message,
      pageUrl: dto.pageUrl,
      uuid: dto.uuid!,
      userId: dto.userId,
      browser: dto.deviceInfo?.browser as string,
      os: dto.deviceInfo?.os as string,
      deviceType: dto.deviceInfo?.device_type as string,
      ip,
      sdkVersion: dto.sdkVersion,
      time: dto.time!,
    });

    return await this.monitorHttpRequestRepository.save(httpData);
  }

  /**
   * 保存性能指标
   */
  private async savePerformance(
    dto: CreateMonitorEventDto,
    ip: string,
  ): Promise<MonitorPerformance> {
    const performanceData = this.monitorPerformanceRepository.create({
      apiKey: dto.apiKey!,
      metricName: dto.name, // SDK使用name字段
      value: dto.value,
      rating: dto.rating,
      pageUrl: dto.pageUrl,
      uuid: dto.uuid!,
      userId: dto.userId,
      browser: dto.deviceInfo?.browser as string,
      os: dto.deviceInfo?.os as string,
      deviceType: dto.deviceInfo?.device_type as string,
      longTask: dto.longTask,
      memory: dto.memory,
      ip,
      sdkVersion: dto.sdkVersion,
      time: dto.time!,
    });

    return await this.monitorPerformanceRepository.save(performanceData);
  }

  /**
   * 保存白屏检测信息
   */
  private async saveWhiteScreen(
    dto: CreateMonitorEventDto,
    ip: string,
  ): Promise<MonitorWhiteScreen> {
    const whiteScreenData = this.monitorWhiteScreenRepository.create({
      apiKey: dto.apiKey!,
      status: dto.status,
      emptyPoints: dto.emptyPoints,
      skeletonData: dto.skeletonData,
      pageUrl: dto.pageUrl,
      uuid: dto.uuid!,
      userId: dto.userId,
      browser: dto.deviceInfo?.browser as string,
      os: dto.deviceInfo?.os as string,
      deviceType: dto.deviceInfo?.device_type as string,
      ip,
      sdkVersion: dto.sdkVersion,
      time: dto.time!,
    });

    return await this.monitorWhiteScreenRepository.save(whiteScreenData);
  }

  /**
   * 更新或创建会话信息
   */
  private async updateSession(
    dto: CreateMonitorEventDto,
    ip: string,
  ): Promise<void> {
    try {
      // 查找现有会话
      let session = await this.monitorSessionRepository.findOne({
        where: { uuid: dto.uuid! },
      });

      if (session) {
        // 更新现有会话
        session.lastSeenAt = dto.time!;
        session.pageViews += 1;

        // 更新错误统计
        if (
          dto.type === 'error' ||
          dto.type === 'unhandledrejection' ||
          dto.type === 'resource'
        ) {
          session.errorCount += 1;
        }
        if (
          (dto.type === 'xhr' || dto.type === 'fetch') &&
          dto.status === 'error'
        ) {
          session.httpErrorCount += 1;
        }
        if (dto.type === 'whiteScreen' && dto.status === 'error') {
          session.whiteScreen = 1;
        }

        await this.monitorSessionRepository.save(session);
      } else {
        // 创建新会话
        session = this.monitorSessionRepository.create({
          apiKey: dto.apiKey!,
          uuid: dto.uuid!,
          userId: dto.userId,
          entryUrl: dto.pageUrl,
          pageViews: 1,
          browser: dto.deviceInfo?.browser as string,
          browserVersion: String(dto.deviceInfo?.browserVersion || ''),
          os: dto.deviceInfo?.os as string,
          osVersion: String(dto.deviceInfo?.osVersion || ''),
          device: dto.deviceInfo?.device as string,
          deviceType: dto.deviceInfo?.device_type as string,
          ua: dto.deviceInfo?.ua as string,
          ip,
          sdkVersion: dto.sdkVersion,
          firstSeenAt: dto.time!,
          lastSeenAt: dto.time!,
          errorCount: ['error', 'unhandledrejection', 'resource'].includes(
            dto.type,
          )
            ? 1
            : 0,
          httpErrorCount:
            ['xhr', 'fetch'].includes(dto.type) && dto.status === 'error'
              ? 1
              : 0,
          whiteScreen:
            dto.type === 'whiteScreen' && dto.status === 'error' ? 1 : 0,
        });

        await this.monitorSessionRepository.save(session);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`更新会话失败: ${err.message}`);
      // 不抛出异常，避免影响主流程
    }
  }

  /**
   * 生成错误哈希
   * 用于错误去重和聚合
   */
  private generateErrorHash(dto: CreateMonitorEventDto): string {
    const hashContent = `${dto.type}-${dto.message}-${dto.fileName}-${dto.line}-${dto.column}`;
    return createHash('md5').update(hashContent).digest('hex');
  }
}
