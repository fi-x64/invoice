import { MetadataKeys } from '@common/constants/common.constant';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ResponseDto } from '@common/interfaces/gateway/response.interfaces';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { catchError, map, Observable } from 'rxjs';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      ctx.getRequest();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];

    return next.handle().pipe(
      map((data: unknown) => {
        const durationMs = Date.now() - startTime;

        if (data instanceof ResponseDto) {
          data.message = data.message ?? HTTP_MESSAGE.OK;
          data.processID = processId;
          data.duration = `${durationMs} ms`;

          return data;
        }

        return new ResponseDto({
          data,
          message: HTTP_MESSAGE.OK,
          processID: processId,
          duration: `${durationMs} ms`,
        });
      }),
      catchError((error) => {
        this.logger.error({ error });

        const durationMs = Date.now() - startTime;

        const message = error?.response?.message || error?.message || error || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const statusCode = this.getHttpStatus(error);

        throw new HttpException(
          new ResponseDto({
            data: null,
            message,
            processID: processId,
            statusCode,
            duration: `${durationMs} ms`,
          }),
          statusCode,
        );
      }),
    );
  }

  private getHttpStatus(error: unknown): number {
    const errorLike = error as {
      code?: unknown;
      response?: { statusCode?: unknown };
      status?: unknown;
      statusCode?: unknown;
    };
    const statusCode = errorLike.statusCode ?? errorLike.status ?? errorLike.response?.statusCode;

    if (typeof statusCode === 'number') {
      return statusCode;
    }

    if (typeof errorLike.code === 'string') {
      return HttpStatus.SERVICE_UNAVAILABLE;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
