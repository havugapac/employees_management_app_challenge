import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
  } from '@nestjs/common';

  export const IS_ADMIN_KEY = 'isAdmin';
  export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
  
  export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      return req.user;
    },
  );
 
  