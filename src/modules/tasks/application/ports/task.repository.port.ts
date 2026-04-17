import type { Task } from '@tasks/domain/entities/task.entity';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepositoryPort {
  save(task: Task): Promise<void>;

  findByIdAndOrganization(
    id: string,
    organizationId: string,
  ): Promise<Task | null>;
}
