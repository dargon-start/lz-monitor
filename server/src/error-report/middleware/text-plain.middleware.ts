import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TextPlainMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (
      req.headers['content-type'] &&
      req.headers['content-type'].includes('text/plain')
    ) {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        try {
          req.body = JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse text/plain content as JSON:', e);
          req.body = {};
        }
        next();
      });
    } else {
      next();
    }
  }
}
