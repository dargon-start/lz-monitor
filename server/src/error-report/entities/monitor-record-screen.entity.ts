import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitor_record_screens')
export class MonitorRecordScreen {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, name: 'api_key' })
  @Index('idx_apikey_time')
  apiKey: string;

  @Column({ length: 100, unique: true, name: 'record_screen_id' })
  @Index('idx_record_screen_id')
  recordScreenId: string;

  // 录屏信息
  @Column({ length: 100 })
  @Index('idx_uuid')
  uuid: string;

  @Column({ length: 100, nullable: true, name: 'user_id' })
  userId: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'bigint', nullable: true, name: 'file_size' })
  fileSize: number;

  // 存储方式（二选一）
  @Column({ type: 'longtext', nullable: true })
  events: string;

  @Column({ length: 500, nullable: true, name: 'oss_url' })
  ossUrl: string;

  // 关联信息
  @Column({ type: 'bigint', nullable: true, name: 'error_id' })
  @Index('idx_error_id')
  errorId: number;

  @Column({ length: 1000, nullable: true, name: 'page_url' })
  pageUrl: string;

  // 元信息
  @Column({ length: 20, name: 'sdk_version' })
  sdkVersion: string;

  @Column({ type: 'bigint' })
  @Index('idx_apikey_time')
  time: number;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expired_at' })
  expiredAt: Date;
}
