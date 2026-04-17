import { Inject, Injectable, Logger } from '@nestjs/common';

import type { Clock } from '@shared/clock/clock';
import { CLOCK } from '@shared/clock/clock.token';
import { isLeft, right, type Either } from '@shared/either/either';
import { maskUuid } from '@shared/logging/mask-identifier';

import { Task } from '@tasks/domain/entities/task.entity';
import type { TaskUseCaseError } from '@tasks/domain/errors/task-errors';
import { CreateTaskResultFactory } from '@tasks/domain/factories/create-task-result.factory';
import type {
  CreateTaskCommand,
  CreateTaskResult,
} from '@tasks/domain/types/create-task.types';

import {
  TASK_REPOSITORY,
  type TaskRepositoryPort,
} from '@tasks/application/ports/task.repository.port';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepositoryPort,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(
    command: CreateTaskCommand,
  ): Promise<Either<TaskUseCaseError, CreateTaskResult>> {
    this.logger.debug(
      `CreateTask started org=${maskUuid(command.organizationId)} assignee=${maskUuid(command.assigneeId)} priority=${command.priority ?? 'default'} titleLength=${command.title.length} hasDescription=${Boolean(command.description?.trim())}`,
    );

    const created = Task.create({
      title: command.title,
      description: command.description,
      assigneeId: command.assigneeId,
      organizationId: command.organizationId,
      dueDate: command.dueDate,
      priority: command.priority,
      clock: this.clock,
    });

    if (isLeft(created)) {
      this.logger.warn(
        `CreateTask rejected by domain org=${maskUuid(command.organizationId)} reason=${created.value.kind}`,
      );

      return created;
    }

    const task = created.value;

    await this.tasks.save(task);

    this.logger.log(
      `CreateTask succeeded taskId=${maskUuid(task.id)} org=${maskUuid(task.organizationId)} status=${task.status} priority=${task.priority}`,
    );

    return right(CreateTaskResultFactory.fromTask(task));
  }
}
