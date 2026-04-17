import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import type { TaskUseCaseError } from '@tasks/domain/errors/task-errors';

export function mapTaskUseCaseErrorToHttp(err: TaskUseCaseError): never {
  switch (err.kind) {

    case 'TASK_NOT_FOUND':
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: err.message,
      });

    case 'INVALID_TRANSITION':
    case 'INVALID_TITLE':
    case 'DUE_DATE_NOT_IN_FUTURE':
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      });
  }
}
