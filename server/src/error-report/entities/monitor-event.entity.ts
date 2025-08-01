import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { FormatDateColumn } from 'src/common/decorator';

@Entity('monitor_events')
export class MonitorEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 20 })
  @Index('idx_event_type')
  event_type: string;

  @Column({ length: 30 })
  @Index('idx_sub_type')
  sub_type: string;

  @Column({ length: 50 })
  @Index('idx_app_id')
  app_id: string;

  @Column({ length: 100, nullable: true })
  @Index('idx_user_id')
  user_id: string;

  @Column({ length: 100 })
  @Index('idx_session_id')
  session_id: string;

  @Column({ length: 1000, nullable: true })
  url: string;

  @Column({ length: 255, nullable: true })
  page_title: string;

  @Column({ length: 1000, nullable: true })
  referrer: string;

  @Column('bigint')
  @Index('idx_timestamp')
  timestamp: number;

  @Column({ length: 50, nullable: true })
  ip: string;

  @Column('json', { nullable: true })
  device_info: Record<string, any>;

  @Column('json', { nullable: true })
  browser_info: Record<string, any>;

  @Column('json', { nullable: true })
  os_info: Record<string, any>;

  @Column('json', { nullable: true })
  network_info: Record<string, any>;

  @Column('json', { nullable: true })
  geo_info: Record<string, any>;

  @Column('json')
  event_data: Record<string, any>;

  @CreateDateColumn()
  @FormatDateColumn()
  created_at: Date;
}
