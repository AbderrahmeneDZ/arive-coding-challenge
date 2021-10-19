import { Request, Response, NextFunction } from "express";
import Hobby from "../models/hobby.model";
import AppError from "../utils/app-error.utils";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Hobby.model.find().lean();
    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await Hobby.model.findById(id);

    if (!data) {
      throw new AppError("Could not found a data with the given id", 404);
    }

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { data } = req.body;

    const { error } = Hobby.validate(data);
    if (error) {
      return next(new AppError(error["details"][0]["message"], 400));
    }

    data = await Hobby.model.create(data);

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let { data } = req.body;

    const { error } = Hobby.validate(data);
    if (error) {
      return next(new AppError(error["details"][0]["message"], 400));
    }

    data = await Hobby.model.findByIdAndUpdate(id, { ...data }, { new: true });

    if (!data) {
      throw new AppError("Could not found a data with the given id", 404);
    }

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const data = await Hobby.model.findByIdAndDelete(id);

    if (!data) {
      throw new AppError("Could not found a data with the given id", 404);
    }

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
