import { Request, Response, NextFunction, RequestHandler } from 'express';

declare module 'express-async-handler' {
  function asyncHandler<
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
  >(
    handler: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction
    ) => Promise<void> | void
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery>;
}