import { Request, Response, NextFunction } from 'express';

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Path ${req.originalUrl} not found`
  });
};
export default notFoundHandler;