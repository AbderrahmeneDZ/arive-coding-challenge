import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import AppError from "../utils/app-error.utils";

export default (params: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const invalidParams = params.filter(
      (param) => !mongoose.Types.ObjectId.isValid(req.params[param])
    );

    if (invalidParams.length > 0) {
      next(
        new AppError(
          `params : ${invalidParams.join(
            ","
          )} should be a valid mongo object id`,
          400
        )
      );
    }

    next();
  };
