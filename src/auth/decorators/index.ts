import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
  } from '@nestjs/common';
  
  
  export const ROLES_KEY = 'roles';
  
  export const AllowRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
  
  export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      return req.user;
    },
  );
  