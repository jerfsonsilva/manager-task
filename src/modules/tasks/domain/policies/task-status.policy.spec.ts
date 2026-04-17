import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

import { TaskStatusPolicy } from './task-status.policy';

describe('TaskStatusPolicy', () => {
  it('should receive PENDING as origin then allow only IN_PROGRESS or CANCELLED', () => {
    expect(
      TaskStatusPolicy.allows(
        TaskStatusEnum.PENDING,
        TaskStatusEnum.IN_PROGRESS,
      ),
    ).toBe(true);
    expect(
      TaskStatusPolicy.allows(TaskStatusEnum.PENDING, TaskStatusEnum.CANCELLED),
    ).toBe(true);

    expect(
      TaskStatusPolicy.allows(TaskStatusEnum.PENDING, TaskStatusEnum.COMPLETED),
    ).toBe(false);
    expect(
      TaskStatusPolicy.allows(TaskStatusEnum.PENDING, TaskStatusEnum.PENDING),
    ).toBe(false);
  });

  it('should receive IN_PROGRESS as origin then allow only COMPLETED or CANCELLED', () => {
    expect(
      TaskStatusPolicy.allows(
        TaskStatusEnum.IN_PROGRESS,
        TaskStatusEnum.COMPLETED,
      ),
    ).toBe(true);
    expect(
      TaskStatusPolicy.allows(
        TaskStatusEnum.IN_PROGRESS,
        TaskStatusEnum.CANCELLED,
      ),
    ).toBe(true);

    expect(
      TaskStatusPolicy.allows(
        TaskStatusEnum.IN_PROGRESS,
        TaskStatusEnum.PENDING,
      ),
    ).toBe(false);
    expect(
      TaskStatusPolicy.allows(
        TaskStatusEnum.IN_PROGRESS,
        TaskStatusEnum.IN_PROGRESS,
      ),
    ).toBe(false);
  });

  it('should receive COMPLETED or CANCELLED as origin then deny every target', () => {
    for (const from of [TaskStatusEnum.COMPLETED, TaskStatusEnum.CANCELLED]) {
      for (const to of Object.values(TaskStatusEnum)) {
        expect(TaskStatusPolicy.allows(from, to)).toBe(false);
      }
    }
  });
});
