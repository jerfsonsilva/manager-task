import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { isLeft } from '@shared/either/either';

import { ChangeTaskStatusUseCase } from '@tasks/application/use-cases/change-task-status/change-task-status.use-case';
import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task/create-task.use-case';

import { OrganizationContextGuard } from '@tasks/presentation/guards/organization-context.guard';
import { OrganizationId } from '@tasks/presentation/decorators/organization-id.decorator';
import { ChangeTaskStatusResponseDto } from '@tasks/presentation/dto/change-task-status-response.dto';
import { CreateTaskDto } from '@tasks/presentation/dto/create-task.dto';
import { PatchTaskStatusDto } from '@tasks/presentation/dto/patch-task-status.dto';
import { mapTaskUseCaseErrorToHttp } from '@tasks/presentation/mappers/task-http.mapper';

@ApiTags('tasks')
@ApiHeader({
  name: 'x-organization-id',
  required: true,
  description: 'UUID da organização (contexto multi-tenant)',
})
@UseGuards(OrganizationContextGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly changeTaskStatus: ChangeTaskStatusUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar tarefa' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarefa criada' })
  @ApiResponse({ status: 400, description: 'Validação ou regra de negócio' })
  async create(
    @Body() body: CreateTaskDto,
    @OrganizationId() organizationId: string,
  ) {
    const result = await this.createTask.execute({
      title: body.title,
      description: body.description ?? null,
      assigneeId: body.assigneeId,
      organizationId,
      dueDate: body.dueDate,
      priority: body.priority,
    });

    if (isLeft(result)) {
      mapTaskUseCaseErrorToHttp(result.value);
    }

    return result.value;
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar status da tarefa' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: PatchTaskStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado',
    type: ChangeTaskStatusResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Transição inválida' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async patchStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PatchTaskStatusDto,
    @OrganizationId() organizationId: string,
  ) {
    const result = await this.changeTaskStatus.execute({
      taskId: id,
      organizationId,
      status: body.status,
    });

    if (isLeft(result)) {
      mapTaskUseCaseErrorToHttp(result.value);
    }

    return result.value;
  }
}
