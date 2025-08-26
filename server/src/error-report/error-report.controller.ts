import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { QueryErrorReportDto } from './dto/query-error-report.dto';
import { ErrorReportService } from './error-report.service';

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
    return this.errorReportService.create(createErrorReportDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取监控事件列表' })
  @ApiResponse({ status: 200, description: '返回监控事件列表' })
  findAll(@Query() queryDto: QueryErrorReportDto) {
    // 使用新的字段名，不需要转换
    return this.errorReportService.findAll(queryDto);
  }
}
