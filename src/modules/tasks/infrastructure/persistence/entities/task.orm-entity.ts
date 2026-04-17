import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('tasks')
@Index(['organizationId', 'id'])
export class TaskOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 32 })
  status!: string;

  @Column({ type: 'varchar', length: 16 })
  priority!: string;

  @Column('uuid')
  assigneeId!: string;

  @Column('uuid')
  organizationId!: string;

  @Column({ type: 'datetime' })
  dueDate!: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'datetime' })
  updatedAt!: Date;
}
