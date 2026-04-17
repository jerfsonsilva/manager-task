import { Test } from '@nestjs/testing';

import { CLOCK } from '@shared/clock/clock.token';

import {
  TASK_REPOSITORY,
  type TaskRepositoryPort,
} from '@tasks/application/ports/task.repository.port';

import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

import {
  completedTaskFixture,
  pendingTaskFixture,
  TaskClocks,
  TaskIds,
} from '@tasks/test/fixtures/task.fixture';
import { expectLeft, expectRight } from '@tasks/test/helpers/expect-either';

import { ChangeTaskStatusUseCase } from './change-task-status.use-case';

describe('ChangeTaskStatusUseCase', () => {
  async function compileWithRepo(
    repo: TaskRepositoryPort,
    clock = TaskClocks.later,
  ) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChangeTaskStatusUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
        { provide: CLOCK, useValue: clock },
      ],
    }).compile();

    return moduleRef.get(ChangeTaskStatusUseCase);
  }

  it('should find no task then return TASK_NOT_FOUND and skip save', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn().mockResolvedValue(null),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute({
      taskId: TaskIds.taskId,
      organizationId: TaskIds.organizationId,
      status: TaskStatusEnum.IN_PROGRESS,
    });

    const { value } = expectLeft(result);

    expect(value.kind).toBe('TASK_NOT_FOUND');
    expect(value.message).toContain(TaskIds.taskId);

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should load completed task then return INVALID_TRANSITION and skip save', async () => {
    const completed = completedTaskFixture();

    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn().mockResolvedValue(completed),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute({
      taskId: TaskIds.taskId,
      organizationId: TaskIds.organizationId,
      status: TaskStatusEnum.IN_PROGRESS,
    });

    expect(expectLeft(result).value.kind).toBe('INVALID_TRANSITION');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should apply valid transition then call save once and return updated status', async () => {
    const task = pendingTaskFixture();

    const repo: TaskRepositoryPort = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndOrganization: jest.fn().mockResolvedValue(task),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute({
      taskId: TaskIds.taskId,
      organizationId: TaskIds.organizationId,
      status: TaskStatusEnum.IN_PROGRESS,
    });

    const { value } = expectRight(result);

    expect(value.status).toBe(TaskStatusEnum.IN_PROGRESS);
    expect(value.updatedAt.toISOString()).toBe(
      TaskClocks.later.now().toISOString(),
    );

    expect(repo.save).toHaveBeenCalledTimes(1);
  });
});
