import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const OrganizationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ organizationId?: string }>();
    const id = req.organizationId;

    if (!id) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Organization context is required',
      });
    }

    return id;
  },
);
