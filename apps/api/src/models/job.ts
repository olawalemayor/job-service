import Joi from "joi";
import { Job } from "../interfaces/job.interface";

export const jobValidationSchema = Joi.object<Job>({
  type: Joi.string().required().valid("email", "report", "image-processing"),
  payload: Joi.when("type", {
    is: "email",
    then: Joi.object({
      to: Joi.string().required(),
      message: Joi.string(),
    }).when("type", {
      is: "report",
      then: Joi.object({
        reportId: Joi.required(),
      }).when("type", {
        is: "image-processing",
        then: Joi.object({
          dataUrl: Joi.string().required(),
        }),
      }),
    }),
  }),
});
