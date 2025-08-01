import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorReportController } from './error-report.controller';
import { ErrorReportService } from './error-report.service';
import { MonitorEvent } from './entities/monitor-event.entity';
import { TextPlainMiddleware } from './middleware/text-plain.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorEvent])],
  controllers: [ErrorReportController],
  providers: [ErrorReportService],
})
export class ErrorReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TextPlainMiddleware).forRoutes('error/report');
  }
}
