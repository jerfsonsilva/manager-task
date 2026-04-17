import { FixedClock } from '@shared/clock/clock';

import type { CreateTaskCommand } from '@tasks/domain/types/create-task.types';

import { Task, type TaskProps } from '@tasks/domain/entities/task.entity';
import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export const TASK_TITLE_MAX_LENGTH = 200;

export const TaskIds = {
  organizationId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  assigneeId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  taskId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
} as const;

const ISO_BASE = '2026-03-23T10:00:00.000Z';
const ISO_LATER = '2026-03-23T15:00:00.000Z';

export const TaskClocks = {
  base: new FixedClock(new Date(ISO_BASE)),
  later: new FixedClock(new Date(ISO_LATER)),
};

export function clockAt(iso: string): FixedClock {
  return new FixedClock(new Date(iso));
}

export function createTaskCommand(
  overrides?: Partial<CreateTaskCommand>,
): CreateTaskCommand {
  return {
    title: '  Minha tarefa  ',
    description: '  Detalhes opcionais  ',
    assigneeId: TaskIds.assigneeId,
    organizationId: TaskIds.organizationId,
    dueDate: new Date('2026-12-31T23:59:59.000Z'),
    ...overrides,
  };
}

export function titleExceedingMaxLength(): string {
  return 'x'.repeat(TASK_TITLE_MAX_LENGTH + 1);
}

export function pendingTaskFixture(overrides?: Partial<TaskProps>): Task {
  const now = TaskClocks.base.now();

  return Task.rehydrate({
    id: TaskIds.taskId,
    title: 'T',
    description: null,
    status: TaskStatusEnum.PENDING,
    priority: TaskPriorityEnum.MEDIUM,
    assigneeId: TaskIds.assigneeId,
    organizationId: TaskIds.organizationId,
    dueDate: new Date('2026-12-31T23:59:59.000Z'),
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

export function completedTaskFixture(overrides?: Partial<TaskProps>): Task {
  const now = TaskClocks.base.now();

  return Task.rehydrate({
    id: TaskIds.taskId,
    title: 'Done',
    description: null,
    status: TaskStatusEnum.COMPLETED,
    priority: TaskPriorityEnum.MEDIUM,
    assigneeId: TaskIds.assigneeId,
    organizationId: TaskIds.organizationId,
    dueDate: new Date('2026-12-31T00:00:00.000Z'),
    completedAt: new Date('2026-03-20T00:00:00.000Z'),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}
