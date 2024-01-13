import { NestMiddleware, Injectable } from '@nestjs/common';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Token Middleware called');
    const token = req.headers.authorization || req.query.token;
    // add token to request
    req.token = token;
    next();
  }
}
