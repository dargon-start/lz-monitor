import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let validationErrors: any[] = [];

    // 处理类验证器抛出的错误
    if (Array.isArray(exceptionResponse.message)) {
      validationErrors = this.formatValidationErrors(exceptionResponse.message);

      // 打印详细验证错误信息
      this.logger.error(
        `验证失败: ${JSON.stringify(exceptionResponse.message)}`,
      );
    } else {
      // 处理其他 BadRequestException 错误
      this.logger.error(`请求错误: ${JSON.stringify(exceptionResponse)}`);
    }

    response.status(status).json({
      success: false,
      message: '请求参数验证失败',
      errors: validationErrors.length
        ? validationErrors
        : exceptionResponse.message,
      timestamp: new Date().toISOString(),
    });
  }

  // 格式化验证错误，使其更易于理解
  private formatValidationErrors(errors: ValidationError[]): any[] {
    const formattedErrors: {
      field: string;
      constraints: { type: string; message: string }[];
    }[] = [];

    const formatError = (error: ValidationError, path = '') => {
      const currentPath = path ? `${path}.${error.property}` : error.property;

      if (error.constraints) {
        const constraints = Object.entries(error.constraints).map(
          ([key, value]) => ({
            type: key,
            message: value,
          }),
        );

        formattedErrors.push({
          field: currentPath,
          constraints,
        });
      }

      if (error.children && error.children.length) {
        error.children.forEach((child) => formatError(child, currentPath));
      }
    };

    errors.forEach((error) => formatError(error));
    return formattedErrors;
  }
}
