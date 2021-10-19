import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import morgan from "morgan";
import config from "config";

import debug from "debug";

import usersRoute from "./routes/users.route";
import hobbiesRoute from "./routes/hobbies.route";

import AppError from "./utils/app-error.utils";

import swaggerDoc from "../docs/swagger.doc";

const dbDebug = debug("app:[MONGO]");
const morganDebug = debug("app:[REQUEST]");

export default async function init() {
  const app = express();
  mongoose.connect(config.get("DB.CONNECTION"), (err) => {
    if (err) {
      dbDebug(
        `error while connecting to database [${config.get("DB.CONNECTION")}]`,
        err
      );
      process.exit(-1);
    }

    dbDebug(`connected successfully [${config.get("DB.CONNECTION")}]`);
  });

  app.use(express.json());
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(swaggerDoc))
  );

  if (process.env.NODE_ENV === "development") {
    app.use(
      morgan(":method :url :status :response-time ms - :res[content-length]", {
        stream: { write: (msg) => morganDebug(msg) },
      })
    );
  }

  // using routes
  app.use("/api/v1/hobbies", hobbiesRoute);
  app.use("/api/v1/users", usersRoute);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.status).json({ error: true, message: err.message });
    }

    next(err);
  });

  return app;
}
