import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateUserAccount implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('ValidateUserAccount middlewawre called');

    const { valid } = req.headers;
    if (valid) {
      console.log('valid: ', valid);

      next();
    } else {
      return res.status(401).send({ error: 'Invalid account' });
    }
  }
}
