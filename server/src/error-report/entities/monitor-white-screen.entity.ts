import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_white_screens')
export class MonitorWhiteScreen {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_status_time')
  apiKey: string;

  @Column({ length: 20 })
  @Index('idx_apikey_status_time')
  status: string; // ok/error

  // 检测详情
  @Column({ type: 'int', nullable: true, name: 'empty_points' })
  emptyPoints: number;

  @Column({ type: 'json', nullable: true, name: 'skeleton_data' })
  skeletonData: Record<string, any>;

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
  @Index('idx_apikey_status_time')
  time: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;
}
