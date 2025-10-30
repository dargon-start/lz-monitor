import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50, unique: true, name: 'api_key' })
  @Index('idx_api_key')
  apiKey: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  domain: string;

  @Column({ type: 'tinyint', default: 1 })
  @Index('idx_status')
  status: number; // 0-禁用 1-启用

  @Column({ type: 'bigint', nullable: true, name: 'owner_id' })
  ownerId: number;

  @Column({ type: 'json', nullable: true, name: 'alert_emails' })
  alertEmails: string[];

  @Column({ type: 'json', nullable: true })
  config: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @FormatDateColumn()
  updatedAt: Date;
}
