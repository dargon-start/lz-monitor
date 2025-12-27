import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextPlainMiddleware } from './middleware/text-plain.middleware';

// 导入 Controller 和 Service
import { MonitorController } from './controllers/monitor.controller';
import { MonitorDataService } from './services/monitor-data.service';
import { MonitorQueryService } from './services/monitor-query.service';
import { ErrorSolutionService } from './services/error-solution.service';
import { GptAnalysisService } from './services/gpt-analysis.service';

// 导入所有 Entity
import {
  MonitorError,
  MonitorEvent,
  MonitorHttpRequest,
  MonitorPerformance,
  MonitorRecordScreen,
  MonitorSession,
  MonitorStatisticsDaily,
  MonitorWhiteScreen,
  Project,
  ErrorSolution,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // 保留 MonitorEvent 实体用于数据迁移
      MonitorEvent,
      // 多表存储 Entity
      Project,
      MonitorError,
      MonitorHttpRequest,
      MonitorPerformance,
      MonitorWhiteScreen,
      MonitorSession,
      MonitorRecordScreen,
      MonitorStatisticsDaily,
      ErrorSolution,
    ]),
  ],
  controllers: [MonitorController],
  providers: [MonitorDataService, MonitorQueryService, ErrorSolutionService, GptAnalysisService],
})
export class ErrorReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TextPlainMiddleware).forRoutes('monitor/report');
  }
}
