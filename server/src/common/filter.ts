import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 安全地获取状态码，默认为 500 (Internal Server Error)
    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      // 如果是 HttpException 类型，使用其 getStatus 和 getMessage 方法
      status = exception.getStatus();
      message = exception.message || exception.getResponse()['message'];
    } else if (exception instanceof Error) {
      // 如果是普通 Error 类型，使用其 message 属性
      console.log('捕获到错误:', exception);

      message = exception.message;
    }

    // 构造统一的错误响应格式
    response.status(status).json({
      message,
      code: status,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
