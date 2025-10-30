import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_performance')
export class MonitorPerformance {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_metric_time')
  apiKey: string;

  @Column({ length: 30, name: 'metric_name' })
  @Index('idx_apikey_metric_time')
  metricName: string; // FCP/LCP/FID/CLS/TTFB

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ length: 20, nullable: true })
  @Index('idx_rating')
  rating: string; // good/needs-improvement/poor

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

  // 长任务信息
  @Column({ type: 'json', nullable: true, name: 'long_task' })
  longTask: Record<string, any>;

  // 内存信息
  @Column({ type: 'json', nullable: true })
  memory: Record<string, any>;

  // 元信息
  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string;

  @Column({ type: 'bigint' })
  @Index('idx_apikey_metric_time')
  time: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;
}
