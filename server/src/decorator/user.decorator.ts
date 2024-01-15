import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: user decorator allow to get the user from request
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request', request.user);
    return request.user;
  },
);
