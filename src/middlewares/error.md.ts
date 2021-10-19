import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.utils";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: true, message: err.message });
  }

  next(err);
};
