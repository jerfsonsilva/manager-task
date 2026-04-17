import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

const ALLOWED_BY_FROM: Record<TaskStatusEnum, readonly TaskStatusEnum[]> = {
  [TaskStatusEnum.PENDING]: [
    TaskStatusEnum.IN_PROGRESS,
    TaskStatusEnum.CANCELLED,
  ],
  [TaskStatusEnum.IN_PROGRESS]: [
    TaskStatusEnum.COMPLETED,
    TaskStatusEnum.CANCELLED,
  ],
  [TaskStatusEnum.COMPLETED]: [],
  [TaskStatusEnum.CANCELLED]: [],
};

export class TaskStatusPolicy {
  private constructor() {}

  static allows(from: TaskStatusEnum, to: TaskStatusEnum): boolean {
    return ALLOWED_BY_FROM[from].includes(to);
  }
}
