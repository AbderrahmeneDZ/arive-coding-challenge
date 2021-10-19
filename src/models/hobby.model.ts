import mongoose from "mongoose";
import config from "config";
import joi from "joi";

const getDefaultYear = () => new Date().getFullYear();

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  passionLevel: {
    type: String,
    require: true,
    enum: [...config.get("HOBBIES.PASSION-LEVEL")],
  },
  year: {
    type: Number,
    required: true,
    default: getDefaultYear,
  },
});

const model = mongoose.model("hobbies", modelSchema);

const validate = function (body) {
  return joi
    .object({
      name: joi.string().min(3).max(50).required(),
      passionLevel: joi
        .string()
        .valid(...config.get("HOBBIES.PASSION-LEVEL"))
        .required(),
      year: joi.number(),
    })
    .validate(body);
};

export default { model, validate };
