import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

@Injectable()
export class OrganizationContextGuard implements CanActivate {
  private static readonly HEADER = 'x-organization-id';

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      organizationId?: string;
    }>();

    const raw = req.headers[OrganizationContextGuard.HEADER];
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (!value || !isUuid(value)) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Missing or invalid header ${OrganizationContextGuard.HEADER}`,
      });
    }

    req.organizationId = value;

    return true;
  }
}
