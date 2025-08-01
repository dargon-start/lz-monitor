import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { ErrorReportService } from './error-report.service';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { QueryErrorReportDto } from './dto/query-error-report.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('error')
@ApiTags('错误监控')
export class ErrorReportController {
  private readonly logger = new Logger(ErrorReportController.name);

  constructor(private readonly errorReportService: ErrorReportService) {}

  @Post('report')
  @ApiOperation({ summary: '上报前端监控事件' })
  @ApiResponse({ status: 200, description: '事件上报成功' })
  @ApiBody({ type: CreateErrorReportDto })
  async create(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    createErrorReportDto: CreateErrorReportDto,
  ) {
    // 中间件已经将 text/plain 内容转换为 JSON，ValidationPipe 会验证转换后的数据
    return this.errorReportService.create(createErrorReportDto);
  }

  @Post('list')
  @ApiOperation({ summary: '获取监控事件列表' })
  @ApiResponse({ status: 200, description: '返回监控事件列表' })
  @ApiBody({ type: QueryErrorReportDto })
  findAll(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    queryDto: QueryErrorReportDto,
  ) {
    // 转换查询参数从驼峰到下划线
    const transformedQuery = {};
    if (queryDto.appId) transformedQuery['app_id'] = queryDto.appId;
    if (queryDto.eventType) transformedQuery['event_type'] = queryDto.eventType;
    if (queryDto.subType) transformedQuery['sub_type'] = queryDto.subType;
    if (queryDto.page) transformedQuery['page'] = queryDto.page;
    if (queryDto.pageSize) transformedQuery['pageSize'] = queryDto.pageSize;

    return this.errorReportService.findAll(transformedQuery);
  }
}
