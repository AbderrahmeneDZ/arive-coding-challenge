import mongoose from "mongoose";
import joi from "joi";

const modelSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hobbies: {
    type: [mongoose.Types.ObjectId],
    ref: "hobbies",
  },
};

const model = mongoose.model("users", new mongoose.Schema(modelSchema));

const validate = function (body) {
  return joi
    .object({
      name: joi.string().min(3).max(50).required(),
      hobbies: joi.array().items(
        joi.string().custom((value, helper) => {
          if (!mongoose.isValidObjectId(value)) {
            return helper.message({
              custom: "hobby item should be a valid mongo object id",
            });
          }
          return true;
        })
      ),
    })
    .validate(body);
};

export default { model, validate };
