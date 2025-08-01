import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ErrorReportModule } from './error-report/error-report.module';

@Module({
  imports: [
    // 集成TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'error-sdk', // 数据库名称
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      timezone: 'Z', // 设置为东八区
    }),
    UserModule,
    UploadModule,
    ErrorReportModule,
  ],
  providers: [
    // 全局使用ValidationPipe进行数据验证
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // 全局使用角色守卫
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
  // exports: [PrismaService], // 移除
})
export class AppModule {}
