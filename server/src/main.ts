import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  VersioningType,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response';
import { HttpFilter } from './common/filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './common/filters/validation.filter';

// const whiteList = ['/user/login', '/user/register'];

// function middleWareAll(req, res, next) {
//   console.log(req.originalUrl, '我收全局的');

//   if (whiteList.includes(req.originalUrl)) {
//     next();
//   } else {
//     res.status(500).send({ code: 500 });
//   }
// }

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/lz',
  });

  // app.useGlobalGuards(new RoleGuard());

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpFilter());

  // 添加全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      // 确保会抛出完整的验证错误
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  // 应用全局验证异常过滤器
  app.useGlobalFilters(new ValidationExceptionFilter());

  // 设置 API 版本
  app.enableVersioning({
    // type: VersioningType.URI, // 使用 URI 版本控制
    // defaultVersion: '1', // 默认版本
    type: VersioningType.HEADER,
    header: 'version',
  });

  // 设置允许跨域请求（如果需要）
  app.enableCors();
  // app.use(middleWareAll);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('lz接口文档')
    .setDescription('描述，。。。')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
