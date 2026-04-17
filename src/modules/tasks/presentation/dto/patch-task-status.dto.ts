import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export class PatchTaskStatusDto {
  @ApiProperty({ enum: TaskStatusEnum, example: TaskStatusEnum.IN_PROGRESS })
  @IsEnum(TaskStatusEnum)
  status!: TaskStatusEnum;
}
