import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_events')
export class MonitorEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 30 })
  @Index('type')
  type: string; // 事件类型，对应 ReportData.type

  @Column({ length: 50, name: 'api_key' })
  @Index('api_key')
  apiKey: string; // 项目ID，对应 ReportData.apiKey

  @Column({ length: 100 })
  @Index('uuid')
  uuid: string; // 页面唯一标识，对应 ReportData.uuid

  @Column({ length: 100, nullable: true, name: 'user_id' })
  @Index('user_id')
  userId: string;

  @Column({ length: 1000, name: 'page_url' })
  pageUrl: string; // 页面地址，对应 ReportData.pageUrl

  @Column('bigint')
  @Index('time')
  time: number; // 发生时间，对应 ReportData.time

  @Column({ length: 20 })
  status: string; // 事件状态，对应 ReportData.status

  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string; // SDK版本，对应 ReportData.sdkVersion

  // HTTP 相关字段
  @Column({ length: 10, nullable: true })
  method: string; // HTTP 方法

  @Column({ length: 1000, nullable: true })
  url: string; // 接口地址

  @Column('int', { nullable: true, name: 'elapsed_time' })
  elapsedTime: number; // 接口耗时

  @Column({ length: 1000, nullable: true })
  message: string; // 错误或接口信息

  @Column('int', { nullable: true, name: 'http_status' })
  httpStatus: number; // HTTP状态码

  @Column('json', { nullable: true, name: 'request_data' })
  requestData: Record<string, any>; // 请求数据

  @Column('json', { nullable: true })
  response: Record<string, any>; // 响应数据

  // 错误相关字段
  @Column('int', { nullable: true })
  line: number; // 错误行号

  @Column('int', { nullable: true })
  column: number; // 错误列号

  @Column({ length: 500, nullable: true, name: 'file_name' })
  fileName: string; // 错误文件名

  @Column({ length: 100, nullable: true })
  name: string; // 资源名称或错误名称

  // 性能相关字段
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  value: number; // 性能指标值

  @Column({ length: 20, nullable: true })
  rating: string; // 性能评级

  // 内存信息
  @Column('json', { nullable: true })
  memory: Record<string, any>; // 内存使用情况

  // 长任务信息
  @Column('json', { nullable: true, name: 'long_task' })
  longTask: Record<string, any>; // 长任务详情

  // 录屏信息
  @Column({ length: 100, nullable: true, name: 'record_screen_id' })
  recordScreenId: string; // 录屏ID

  @Column('longtext', { nullable: true })
  events: string; // 录屏事件数据

  // 设备信息
  @Column('json', { name: 'device_info' })
  deviceInfo: {
    browserVersion: string | number;
    browser: string;
    osVersion: string | number;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };

  // 用户行为栈
  @Column('json', { nullable: true })
  breadcrumb: Array<{
    type: string;
    category: string;
    status: string;
    time: number;
    data: any;
  }>;

  // 扩展字段，存储其他自定义数据
  @Column('json', { nullable: true, name: 'extra_data' })
  extraData: Record<string, any>;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;
}
