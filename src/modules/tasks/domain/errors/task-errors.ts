import type { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export type TaskDomainError =
  | {
      readonly kind: 'INVALID_TITLE';
      readonly message: string;
    }
  | {
      readonly kind: 'DUE_DATE_NOT_IN_FUTURE';
      readonly message: string;
    }
  | {
      readonly kind: 'INVALID_TRANSITION';
      readonly from: TaskStatusEnum;
      readonly to: TaskStatusEnum;
      readonly message: string;
    };

export type TaskNotFoundError = {
  readonly kind: 'TASK_NOT_FOUND';
  readonly taskId: string;
  readonly message: string;
};

export type TaskUseCaseError = TaskDomainError | TaskNotFoundError;

export const invalidTitle = (message: string): TaskDomainError => ({
  kind: 'INVALID_TITLE',
  message,
});

export const dueDateNotInFuture = (message: string): TaskDomainError => ({
  kind: 'DUE_DATE_NOT_IN_FUTURE',
  message,
});

export const invalidTransition = (
  from: TaskStatusEnum,
  to: TaskStatusEnum,
): TaskDomainError => ({
  kind: 'INVALID_TRANSITION',
  from,
  to,
  message: `Cannot transition from ${from} to ${to}`,
});

export const taskNotFound = (taskId: string): TaskNotFoundError => ({
  kind: 'TASK_NOT_FOUND',
  taskId,
  message: `Task with ID ${taskId} not found`,
});
