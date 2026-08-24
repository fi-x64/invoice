import { MetadataKeys } from '@common/constants/common.constant';
import { getProcessId } from '@common/utils/string.util';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;
    const processId = getProcessId();
    const now = Date.now();

    // Set metadata for tracking
    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP » Start process '${processId}' » path: '${originalUrl}' » method: '${method}' at ${now} >> input: ${JSON.stringify(body)}`,
    );

    // Override response để log completion
    const originalSend = res.send.bind(res);
    res.send = (body: any): Response => {
      const durationMs = Date.now() - startTime;
      Logger.log(
        `HTTP » Start process '${processId}' » path: '${originalUrl}' » method: '${method}' at ${now} >> input: ${durationMs}`,
      );

      return originalSend(body);
    };

    next();
  }
}
