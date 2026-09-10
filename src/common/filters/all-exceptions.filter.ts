import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const requestId = httpContext.getRequest<Request & { id?: string }>().id;

    if (!(exception instanceof HttpException)) {
      // requestId đi kèm log để trace lỗi 500 xuyên các service khác (Definition of Done —
      // full-scope-plan.md); KHÔNG đưa vào response body vì đó là chi tiết nội bộ, không phải
      // hợp đồng API với client.
      this.logger.error(
        `Unhandled exception [requestId=${requestId}]`,
        exception,
      );
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: { body: ['Internal server error'] },
      });
      return;
    }

    const status = exception.getStatus();
    const body =
      exception instanceof I18nValidationException
        ? this.flattenI18nValidationErrors(exception)
        : this.extractMessages(exception.getResponse());

    response.status(status).json({ errors: { body } });
  }

  private flattenI18nValidationErrors(
    exception: I18nValidationException,
  ): string[] {
    return exception.errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .map(String);
  }

  private extractMessages(exceptionResponse: string | object): string[] {
    if (typeof exceptionResponse === 'string') {
      return [exceptionResponse];
    }

    const { message, statusCode } = exceptionResponse as {
      message?: unknown;
      statusCode?: number;
    };
    if (Array.isArray(message)) {
      return message.map(String);
    }
    if (typeof message === 'string') {
      return [message];
    }
    return [
      (statusCode !== undefined ? HttpStatus[statusCode] : undefined) ??
        'Error',
    ];
  }
}
