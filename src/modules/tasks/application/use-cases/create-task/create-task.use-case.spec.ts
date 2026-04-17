import { Test } from '@nestjs/testing';

import { CLOCK } from '@shared/clock/clock.token';

import {
  TASK_REPOSITORY,
  type TaskRepositoryPort,
} from '@tasks/application/ports/task.repository.port';

import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

import {
  createTaskCommand,
  TaskClocks,
  TaskIds,
  titleExceedingMaxLength,
} from '@tasks/test/fixtures/task.fixture';
import { expectLeft, expectRight } from '@tasks/test/helpers/expect-either';

import { CreateTaskUseCase } from './create-task.use-case';

describe('CreateTaskUseCase', () => {
  async function compileWithRepo(repo: TaskRepositoryPort) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
        { provide: CLOCK, useValue: TaskClocks.base },
      ],
    }).compile();

    return moduleRef.get(CreateTaskUseCase);
  }

  it('should receive valid command then call save once and return trimmed task with defaults', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(createTaskCommand());

    const { value } = expectRight(result);

    expect(value.title).toBe('Minha tarefa');
    expect(value.description).toBe('Detalhes opcionais');
    expect(value.status).toBe(TaskStatusEnum.PENDING);
    expect(value.priority).toBe(TaskPriorityEnum.MEDIUM);
    expect(value.organizationId).toBe(TaskIds.organizationId);
    expect(value.assigneeId).toBe(TaskIds.assigneeId);
    expect(value.completedAt).toBeNull();
    expect(value.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );

    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('should receive explicit HIGH priority then persist and return HIGH priority', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({ priority: TaskPriorityEnum.HIGH }),
    );

    expect(expectRight(result).value.priority).toBe(TaskPriorityEnum.HIGH);
  });

  it('should receive undefined description then persist and return null description', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({ description: undefined }),
    );

    expect(expectRight(result).value.description).toBeNull();
  });

  it('should receive null description then persist and return null description', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({ description: null }),
    );

    expect(expectRight(result).value.description).toBeNull();
  });

  it('should receive blank trimmed title then return Left with INVALID_TITLE and skip save', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(createTaskCommand({ title: '   ' }));

    expect(expectLeft(result).value.kind).toBe('INVALID_TITLE');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should receive title with only tabs and newlines then return Left with INVALID_TITLE and skip save', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({ title: '\t  \n  \t' }),
    );

    expect(expectLeft(result).value.kind).toBe('INVALID_TITLE');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should receive title over max length then return Left with INVALID_TITLE and skip save', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({ title: titleExceedingMaxLength() }),
    );

    expect(expectLeft(result).value.kind).toBe('INVALID_TITLE');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should receive due date equal to clock then return Left with DUE_DATE_NOT_IN_FUTURE and skip save', async () => {
    const now = TaskClocks.base.now();

    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(createTaskCommand({ dueDate: now }));

    expect(expectLeft(result).value.kind).toBe('DUE_DATE_NOT_IN_FUTURE');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should receive past due date then return Left with DUE_DATE_NOT_IN_FUTURE and skip save', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    const result = await useCase.execute(
      createTaskCommand({
        dueDate: new Date('2026-03-23T09:59:59.000Z'),
      }),
    );

    expect(expectLeft(result).value.kind).toBe('DUE_DATE_NOT_IN_FUTURE');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should run two invalid commands then never call save and leave repository untouched', async () => {
    const repo: TaskRepositoryPort = {
      save: jest.fn(),
      findByIdAndOrganization: jest.fn(),
    };

    const useCase = await compileWithRepo(repo);

    await useCase.execute(createTaskCommand({ title: '' }));
    await useCase.execute(
      createTaskCommand({ dueDate: new Date('2000-01-01T00:00:00.000Z') }),
    );

    expect(repo.save).not.toHaveBeenCalled();
  });
});
