import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { TaskPriorityEnum } from '@tasks/domain/enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar módulo de relatórios', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Criar relatórios mensais de vendas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  assigneeId!: string;

  @ApiPropertyOptional({
    enum: TaskPriorityEnum,
    default: TaskPriorityEnum.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @ApiProperty({ example: '2026-03-30T23:59:59.000Z' })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}
