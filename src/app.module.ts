import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { TaskOrmEntity } from '@tasks/infrastructure/persistence/entities/task.orm-entity';

import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'data', 'tasks.sqlite'),
      entities: [TaskOrmEntity],
      synchronize: true,
    }),
    TasksModule,
  ],
})
export class AppModule {}
