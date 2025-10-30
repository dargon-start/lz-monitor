import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('monitor_statistics_daily')
@Index(['apiKey', 'statDate'], { unique: true })
export class MonitorStatisticsDaily {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  apiKey: string;

  @Column({ type: 'date', name: 'stat_date' })
  @Index('idx_stat_date')
  statDate: Date;

  // 错误统计
  @Column({ type: 'int', default: 0, name: 'error_count' })
  errorCount: number;

  @Column({ type: 'int', default: 0, name: 'js_error_count' })
  jsErrorCount: number;

  @Column({ type: 'int', default: 0, name: 'resource_error_count' })
  resourceErrorCount: number;

  @Column({ type: 'int', default: 0, name: 'promise_error_count' })
  promiseErrorCount: number;

  // HTTP统计
  @Column({ type: 'int', default: 0, name: 'http_request_count' })
  httpRequestCount: number;

  @Column({ type: 'int', default: 0, name: 'http_error_count' })
  httpErrorCount: number;

  @Column({ type: 'int', nullable: true, name: 'avg_response_time' })
  avgResponseTime: number;

  // 性能统计
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'avg_fcp',
  })
  avgFcp: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'avg_lcp',
  })
  avgLcp: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'avg_fid',
  })
  avgFid: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'avg_cls',
  })
  avgCls: number;

  // 用户统计
  @Column({ type: 'int', default: 0, name: 'session_count' })
  sessionCount: number;

  @Column({ type: 'int', default: 0, name: 'unique_users' })
  uniqueUsers: number;

  @Column({ type: 'int', default: 0 })
  pv: number;

  @Column({ type: 'int', default: 0, name: 'white_screen_count' })
  whiteScreenCount: number;

  // 设备分布
  @Column({ type: 'json', nullable: true, name: 'device_distribution' })
  deviceDistribution: Record<string, any>;

  @Column({ type: 'json', nullable: true, name: 'browser_distribution' })
  browserDistribution: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @FormatDateColumn()
  updatedAt: Date;
}
