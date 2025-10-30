import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_errors')
export class MonitorError {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_type_time')
  apiKey: string;

  @Column({ length: 30, name: 'error_type' })
  @Index('idx_apikey_type_time')
  errorType: string; // error/unhandledrejection/resource

  @Column({ length: 64, nullable: true, name: 'error_hash' })
  @Index('idx_error_hash')
  errorHash: string;

  // 错误详情
  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ length: 500, nullable: true, name: 'file_name' })
  fileName: string;

  @Column({ type: 'int', nullable: true })
  line: number;

  @Column({ type: 'int', nullable: true })
  column: number;

  @Column({ type: 'text', nullable: true })
  stack: string;

  @Column({ length: 100, nullable: true })
  name: string;

  // 页面信息
  @Column({ length: 1000, name: 'page_url' })
  pageUrl: string;

  @Column({ length: 100 })
  @Index('idx_uuid')
  uuid: string;

  @Column({ length: 100, nullable: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: string;

  // 设备信息
  @Column({ length: 50, nullable: true })
  browser: string;

  @Column({ length: 20, nullable: true, name: 'browser_version' })
  browserVersion: string;

  @Column({ length: 50, nullable: true })
  os: string;

  @Column({ length: 20, nullable: true, name: 'os_version' })
  osVersion: string;

  @Column({ length: 20, nullable: true, name: 'device_type' })
  deviceType: string;

  @Column({ length: 100, nullable: true })
  device: string;

  @Column({ length: 500, nullable: true })
  ua: string;

  // 上下文信息
  @Column({ type: 'json', nullable: true })
  breadcrumb: Array<{
    type: string;
    category: string;
    status: string;
    time: number;
    data: any;
  }>;

  @Column({ length: 100, nullable: true, name: 'record_screen_id' })
  recordScreenId: string;

  @Column({ type: 'json', nullable: true, name: 'extra_data' })
  extraData: Record<string, any>;

  // 元信息
  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string;

  @Column({ length: 20, default: 'error' })
  status: string;

  @Column({ type: 'bigint' })
  @Index('idx_time')
  @Index('idx_apikey_type_time')
  time: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;
}
