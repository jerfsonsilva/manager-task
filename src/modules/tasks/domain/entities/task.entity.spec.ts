import { FixedClock } from '@shared/clock/clock';

import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';
import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';
import { expectLeft, expectRight } from '@tasks/test/helpers/expect-either';

import { Task } from './task.entity';

describe('Task', () => {
  const baseNow = new Date('2026-03-23T10:00:00.000Z');
  const clock = new FixedClock(baseNow);

  const validInput = () => ({
    title: '  Implementar relatórios  ',
    description: '  Detalhes  ',
    assigneeId: '11111111-1111-4111-8111-111111111111',
    organizationId: '22222222-2222-4222-8222-222222222222',
    dueDate: new Date('2026-03-30T23:59:59.000Z'),
    clock,
  });

  it('should receive valid input then create PENDING MEDIUM task with trimmed title and description', () => {
    const result = Task.create(validInput());
    const { value: t } = expectRight(result);

    expect(t.status).toBe(TaskStatusEnum.PENDING);
    expect(t.priority).toBe(TaskPriorityEnum.MEDIUM);
    expect(t.title).toBe('Implementar relatórios');
    expect(t.description).toBe('Detalhes');
    expect(t.completedAt).toBeNull();
  });

  it('should receive explicit HIGH priority then create task with HIGH priority', () => {
    const result = Task.create({
      ...validInput(),
      priority: TaskPriorityEnum.HIGH,
    });

    expect(expectRight(result).value.priority).toBe(TaskPriorityEnum.HIGH);
  });

  it('should receive whitespace-only title then return Left with INVALID_TITLE', () => {
    const result = Task.create({ ...validInput(), title: '   ' });

    expect(expectLeft(result).value.kind).toBe('INVALID_TITLE');
  });

  it('should receive due date before clock then return Left with DUE_DATE_NOT_IN_FUTURE', () => {
    const result = Task.create({
      ...validInput(),
      dueDate: new Date('2026-03-23T09:59:59.000Z'),
    });

    expect(expectLeft(result).value.kind).toBe('DUE_DATE_NOT_IN_FUTURE');
  });

  it('should transition from PENDING to IN_PROGRESS then update updatedAt to new clock time', () => {
    const { value: task } = expectRight(Task.create(validInput()));

    const next = task.transitionTo(
      TaskStatusEnum.IN_PROGRESS,
      new FixedClock(new Date('2026-03-23T11:00:00.000Z')),
    );

    const { value: moved } = expectRight(next);

    expect(moved.status).toBe(TaskStatusEnum.IN_PROGRESS);
    expect(moved.updatedAt.toISOString()).toBe('2026-03-23T11:00:00.000Z');
  });

  it('should transition from IN_PROGRESS to COMPLETED then set completedAt to completion time', () => {
    const { value: created } = expectRight(Task.create(validInput()));

    const { value: inProgress } = expectRight(
      created.transitionTo(TaskStatusEnum.IN_PROGRESS, clock),
    );

    const doneAt = new Date('2026-03-24T12:00:00.000Z');
    const completed = inProgress.transitionTo(
      TaskStatusEnum.COMPLETED,
      new FixedClock(doneAt),
    );

    const { value: done } = expectRight(completed);

    expect(done.status).toBe(TaskStatusEnum.COMPLETED);
    expect(done.completedAt?.toISOString()).toBe(doneAt.toISOString());
  });

  it('should attempt reopen from COMPLETED to IN_PROGRESS then return Left with INVALID_TRANSITION', () => {
    let t = expectRight(Task.create(validInput())).value;

    for (const st of [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.COMPLETED]) {
      t = expectRight(t.transitionTo(st, clock)).value;
    }

    const bad = t.transitionTo(TaskStatusEnum.IN_PROGRESS, clock);
    const { value: err } = expectLeft(bad);

    expect(err.kind).toBe('INVALID_TRANSITION');
    expect(err.message).toContain('COMPLETED');
    expect(err.message).toContain('IN_PROGRESS');
  });

  it('should transition to identical status then return same instance without mutating state', () => {
    const created = expectRight(Task.create(validInput()));
    const again = created.value.transitionTo(TaskStatusEnum.PENDING, clock);

    expect(expectRight(again).value).toBe(created.value);
  });
});
