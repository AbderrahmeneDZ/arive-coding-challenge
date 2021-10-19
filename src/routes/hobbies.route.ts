import express from "express";
import objectIdMd from "../middlewares/objectId.md";
import controller from "../controllers/hobbies.controller";

const router = express.Router();

router.route("/").get(controller.getAll).post(controller.create);

router
  .route("/:id")
  .get(objectIdMd(["id"]), controller.getById)
  .put(objectIdMd(["id"]), controller.update)
  .delete(objectIdMd(["id"]), controller.remove);

export default router;
