import { Task } from '@tasks/domain/entities/task.entity';
import type { CreateTaskResult } from '@tasks/domain/types/create-task.types';

export class CreateTaskResultFactory {
  private constructor() {}

  static fromTask(task: Task): CreateTaskResult {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      organizationId: task.organizationId,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
