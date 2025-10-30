import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_http_requests')
export class MonitorHttpRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_time')
  @Index('idx_apikey_status')
  apiKey: string;

  @Column({ length: 10, name: 'request_type' })
  requestType: string; // xhr/fetch

  // 请求信息
  @Column({ length: 10, nullable: true })
  method: string;

  @Column({ length: 1000 })
  url: string;

  @Column({ length: 64, nullable: true, name: 'url_hash' })
  @Index('idx_url_hash')
  urlHash: string;

  @Column({ type: 'int', nullable: true, name: 'http_status' })
  @Index('idx_http_status')
  httpStatus: number;

  @Column({ length: 20, nullable: true })
  @Index('idx_apikey_status')
  status: string; // ok/error

  // 性能指标
  @Column({ type: 'int', nullable: true, name: 'elapsed_time' })
  elapsedTime: number;

  @Column({ type: 'int', nullable: true, name: 'request_size' })
  requestSize: number;

  @Column({ type: 'int', nullable: true, name: 'response_size' })
  responseSize: number;

  // 详细数据
  @Column({ type: 'json', nullable: true, name: 'request_data' })
  requestData: Record<string, any>;

  @Column({ type: 'json', nullable: true, name: 'response_data' })
  responseData: Record<string, any>;

  @Column({ length: 1000, nullable: true })
  message: string;

  // 页面信息
  @Column({ length: 1000, name: 'page_url' })
  pageUrl: string;

  @Column({ length: 100 })
  @Index('idx_uuid')
  uuid: string;

  @Column({ length: 100, nullable: true, name: 'user_id' })
  userId: string;

  // 设备信息
  @Column({ length: 50, nullable: true })
  browser: string;

  @Column({ length: 50, nullable: true })
  os: string;

  @Column({ length: 20, nullable: true, name: 'device_type' })
  deviceType: string;

  // 元信息
  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string;

  @Column({ type: 'bigint' })
  @Index('idx_apikey_time')
  time: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;
}
