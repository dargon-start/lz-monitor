import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('monitor_sessions')
export class MonitorSession {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_time')
  apiKey: string;

  @Column({ length: 100, unique: true })
  @Index('idx_uuid')
  uuid: string;

  @Column({ length: 100, nullable: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: string;

  // 会话信息
  @Column({ length: 1000, nullable: true, name: 'entry_url' })
  entryUrl: string;

  @Column({ length: 1000, nullable: true, name: 'exit_url' })
  exitUrl: string;

  @Column({ type: 'int', default: 0, name: 'page_views' })
  pageViews: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  // 设备信息
  @Column({ length: 50, nullable: true })
  browser: string;

  @Column({ length: 20, nullable: true, name: 'browser_version' })
  browserVersion: string;

  @Column({ length: 50, nullable: true })
  os: string;

  @Column({ length: 20, nullable: true, name: 'os_version' })
  osVersion: string;

  @Column({ length: 100, nullable: true })
  device: string;

  @Column({ length: 20, nullable: true, name: 'device_type' })
  deviceType: string;

  @Column({ length: 500, nullable: true })
  ua: string;

  @Column({ length: 20, nullable: true, name: 'screen_resolution' })
  screenResolution: string;

  // 网络信息
  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ length: 50, nullable: true })
  province: string;

  @Column({ length: 50, nullable: true })
  city: string;

  // 统计信息
  @Column({ type: 'int', default: 0, name: 'error_count' })
  errorCount: number;

  @Column({ type: 'int', default: 0, name: 'http_error_count' })
  httpErrorCount: number;

  @Column({ type: 'tinyint', default: 0, name: 'white_screen' })
  whiteScreen: number; // 0-否 1-是

  // 元信息
  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string;

  @Column({ type: 'bigint', nullable: true, name: 'first_seen_at' })
  @Index('idx_apikey_time')
  firstSeenAt: number;

  @Column({ type: 'bigint', nullable: true, name: 'last_seen_at' })
  lastSeenAt: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @FormatDateColumn()
  updatedAt: Date;
}
