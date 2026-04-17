import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemClock } from '@shared/clock/clock';
import { CLOCK } from '@shared/clock/clock.token';

import { ChangeTaskStatusUseCase } from '@tasks/application/use-cases/change-task-status/change-task-status.use-case';
import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task/create-task.use-case';
import { TASK_REPOSITORY } from '@tasks/application/ports/task.repository.port';

import { TaskOrmEntity } from '@tasks/infrastructure/persistence/entities/task.orm-entity';
import { TypeOrmTaskRepository } from '@tasks/infrastructure/persistence/repositories/typeorm-task.repository';

import { TasksController } from '@tasks/presentation/controllers/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ChangeTaskStatusUseCase,
    { provide: TASK_REPOSITORY, useClass: TypeOrmTaskRepository },
    { provide: CLOCK, useClass: SystemClock },
  ],
})
export class TasksModule {}
