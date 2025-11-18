import { FormatDateColumn } from 'src/common/decorator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('error_solutions')
export class ErrorSolution {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 64, name: 'error_hash', unique: true })
  @Index('idx_error_hash')
  errorHash: string;

  @Column({ type: 'text', nullable: true })
  solution: string;

  @Column({ type: 'text', nullable: true, name: 'gpt_analysis' })
  gptAnalysis: string;

  @Column({ length: 50, nullable: true, name: 'created_by' })
  createdBy: string;

  @Column({ length: 50, nullable: true, name: 'updated_by' })
  updatedBy: string;

  @Column({ type: 'tinyint', default: 0, name: 'is_manual' })
  isManual: number; // 0: GPT生成, 1: 手动

  @Column({ type: 'tinyint', default: 1 })
  enabled: number; // 0: 禁用, 1: 启用

  @CreateDateColumn({ name: 'created_at' })
  @FormatDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @FormatDateColumn()
  updatedAt: Date;
}
