import type { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export type ChangeTaskStatusCommand = {
  taskId: string;
  organizationId: string;
  status: TaskStatusEnum;
};

export type ChangeTaskStatusResult = {
  id: string;
  status: TaskStatusEnum;
  completedAt: Date | null;
  updatedAt: Date;
};
