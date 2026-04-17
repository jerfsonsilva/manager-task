import type { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import type { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export type CreateTaskCommand = {
  title: string;
  description?: string | null;
  assigneeId: string;
  organizationId: string;
  dueDate: Date;
  priority?: TaskPriorityEnum;
};

export type CreateTaskResult = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  assigneeId: string;
  organizationId: string;
  dueDate: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
