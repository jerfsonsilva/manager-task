import { Inject, Injectable, Logger } from '@nestjs/common';

import type { Clock } from '@shared/clock/clock';
import { CLOCK } from '@shared/clock/clock.token';
import { isLeft, left, right, type Either } from '@shared/either/either';
import { maskUuid } from '@shared/logging/mask-identifier';

import type { TaskUseCaseError } from '@tasks/domain/errors/task-errors';
import { taskNotFound } from '@tasks/domain/errors/task-errors';
import type {
  ChangeTaskStatusCommand,
  ChangeTaskStatusResult,
} from '@tasks/domain/types/change-task-status.types';

import {
  TASK_REPOSITORY,
  type TaskRepositoryPort,
} from '@tasks/application/ports/task.repository.port';

@Injectable()
export class ChangeTaskStatusUseCase {
  private readonly logger = new Logger(ChangeTaskStatusUseCase.name);

  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepositoryPort,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(
    command: ChangeTaskStatusCommand,
  ): Promise<Either<TaskUseCaseError, ChangeTaskStatusResult>> {
    this.logger.debug(
      `ChangeTaskStatus started taskId=${maskUuid(command.taskId)} org=${maskUuid(command.organizationId)} targetStatus=${command.status}`,
    );

    const existing = await this.tasks.findByIdAndOrganization(
      command.taskId,
      command.organizationId,
    );

    if (!existing) {
      this.logger.warn(
        `ChangeTaskStatus task not found taskId=${maskUuid(command.taskId)} org=${maskUuid(command.organizationId)}`,
      );

      return left(taskNotFound(command.taskId));
    }

    const transitioned = existing.transitionTo(command.status, this.clock);
    if (isLeft(transitioned)) {
      const err = transitioned.value;
      const transitionContext =
        err.kind === 'INVALID_TRANSITION'
          ? ` from=${err.from} to=${err.to}`
          : '';

      this.logger.warn(
        `ChangeTaskStatus transition rejected taskId=${maskUuid(command.taskId)} org=${maskUuid(command.organizationId)} currentStatus=${existing.status} targetStatus=${command.status} reason=${err.kind}${transitionContext}`,
      );

      return transitioned;
    }

    await this.tasks.save(transitioned.value);
    const t = transitioned.value;

    this.logger.log(
      `ChangeTaskStatus succeeded taskId=${maskUuid(t.id)} org=${maskUuid(command.organizationId)} previousStatus=${existing.status} newStatus=${t.status}`,
    );

    return right({
      id: t.id,
      status: t.status,
      completedAt: t.completedAt,
      updatedAt: t.updatedAt,
    });
  }
}
