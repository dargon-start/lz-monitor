import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { map, tap } from 'rxjs/operators';

// 响应拦截器
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(
        tap(() => {
          // 如果是 POST 请求且响应状态码为 201，则修改为 200 OK
          if (request.method === 'POST' && response.statusCode === 201) {
            response.status(HttpStatus.OK);
          }
        }),
      )
      .pipe(
        map((data) => ({
          code: context.switchToHttp().getResponse().statusCode,
          data,
          message: '成功',
          success: true,
        })),
      );
  }
}
