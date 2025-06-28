// import { NextFunction, Request, RequestHandler, Response } from 'express';

// // catchAsync
// const catchAsync = (fn: RequestHandler) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => next(err));
//   };
// };

// export default catchAsync;

// utils/catchAsync.ts
import { NextFunction, Request, Response, RequestHandler } from 'express';

const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
