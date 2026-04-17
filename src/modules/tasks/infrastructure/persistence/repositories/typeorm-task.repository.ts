import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { TaskRepositoryPort } from '@tasks/application/ports/task.repository.port';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

import { TaskOrmEntity } from '@tasks/infrastructure/persistence/entities/task.orm-entity';

@Injectable()
export class TypeOrmTaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repo: Repository<TaskOrmEntity>,
  ) {}

  async save(task: Task): Promise<void> {
    const row = this.toOrm(task);

    await this.repo.save(row);
  }

  async findByIdAndOrganization(
    id: string,
    organizationId: string,
  ): Promise<Task | null> {
    const row = await this.repo.findOne({ where: { id, organizationId } });

    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: TaskOrmEntity): Task {

    return Task.rehydrate({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as TaskStatusEnum,
      priority: row.priority as TaskPriorityEnum,
      assigneeId: row.assigneeId,
      organizationId: row.organizationId,
      dueDate: row.dueDate,
      completedAt: row.completedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toOrm(task: Task): TaskOrmEntity {
    const p = task.toProps();
    const row = new TaskOrmEntity();

    row.id = p.id;
    row.title = p.title;
    row.description = p.description;
    row.status = p.status;
    row.priority = p.priority;
    row.assigneeId = p.assigneeId;
    row.organizationId = p.organizationId;
    row.dueDate = p.dueDate;
    row.completedAt = p.completedAt;
    row.createdAt = p.createdAt;
    row.updatedAt = p.updatedAt;

    return row;
  }
}
