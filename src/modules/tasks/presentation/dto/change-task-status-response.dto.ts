import { ApiProperty } from '@nestjs/swagger';

import { TaskStatusEnum } from '@tasks/domain/enums/task-status.enum';

export class ChangeTaskStatusResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: TaskStatusEnum })
  status!: TaskStatusEnum;

  @ApiProperty({
    nullable: true,
    description: 'Preenchido quando o status é COMPLETED',
    type: String,
    format: 'date-time',
  })
  completedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
