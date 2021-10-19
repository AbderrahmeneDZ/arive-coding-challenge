import express from "express";
import asyncErrorHandler from "../utils/async.utils";
import objectIdMd from "../middlewares/objectId.md";
import controller from "../controllers/hobbies.controller";

const router = express.Router();

router
  .route("/")
  .get(asyncErrorHandler(controller.getAll))
  .post(asyncErrorHandler(controller.create));

router
  .route("/:id")
  .get(objectIdMd(["id"]), asyncErrorHandler(controller.getById))
  .put(objectIdMd(["id"]), asyncErrorHandler(controller.update))
  .delete(objectIdMd(["id"]), asyncErrorHandler(controller.remove));

export default router;
