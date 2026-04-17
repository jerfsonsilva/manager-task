import { randomUUID } from 'crypto';

import type { Clock } from '@shared/clock/clock';
import { type Either, left, right } from '@shared/either/either';
import {
  dueDateNotInFuture,
  invalidTitle,
  invalidTransition,
  type TaskDomainError,
} from '@tasks/domain/errors/task-errors';

import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';
import { TaskStatusPolicy } from '@tasks/domain/policies/task-status.policy';

const TITLE_MAX = 200;

export type TaskProps = {
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

export class Task {
  private constructor(private readonly props: TaskProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get status(): TaskStatusEnum {
    return this.props.status;
  }

  get priority(): TaskPriorityEnum {
    return this.props.priority;
  }

  get assigneeId(): string {
    return this.props.assigneeId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(input: {
    title: string;
    description: string | null | undefined;
    assigneeId: string;
    organizationId: string;
    dueDate: Date;
    priority?: TaskPriorityEnum;
    clock: Clock;
  }): Either<TaskDomainError, Task> {
    const trimmed = input.title.trim();

    if (trimmed.length === 0 || trimmed.length > TITLE_MAX) {
      return left(
        invalidTitle(
          `Title is required and must be at most ${TITLE_MAX} characters`,
        ),
      );
    }

    const now = input.clock.now();

    if (input.dueDate.getTime() <= now.getTime()) {
      return left(dueDateNotInFuture('Due date must be in the future'));
    }

    const task = new Task({
      id: randomUUID(),
      title: trimmed,
      description: input.description?.trim() ?? null,
      status: TaskStatusEnum.PENDING,
      priority: input.priority ?? TaskPriorityEnum.MEDIUM,
      assigneeId: input.assigneeId,
      organizationId: input.organizationId,
      dueDate: input.dueDate,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return right(task);
  }

  static rehydrate(props: TaskProps): Task {
    return new Task(props);
  }

  toProps(): TaskProps {
    return { ...this.props };
  }

  transitionTo(
    newStatus: TaskStatusEnum,
    clock: Clock,
  ): Either<TaskDomainError, Task> {
    const from = this.props.status;

    if (from === newStatus) {
      return right(this);
    }

    if (!TaskStatusPolicy.allows(from, newStatus)) {
      return left(invalidTransition(from, newStatus));
    }

    const now = clock.now();
    const completedAt =
      newStatus === TaskStatusEnum.COMPLETED ? now : this.props.completedAt;

    return right(
      new Task({
        ...this.props,
        status: newStatus,
        completedAt,
        updatedAt: now,
      }),
    );
  }
}
