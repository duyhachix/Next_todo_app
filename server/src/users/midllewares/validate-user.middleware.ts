import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // perform validation logic
    // check if user has jwt token, authorization

    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(403)
        .send({ error: 'There no authorization token provided' });
    }
    // sau nay khi co authorization
    if (authorization === `123`) {
      next();
    } else {
      return res
        .status(403)
        .send({ error: 'Invalid authorization token provided' });
    }
  }
}
