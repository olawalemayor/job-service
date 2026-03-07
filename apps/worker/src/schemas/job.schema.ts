import { model, Schema } from "mongoose";
import { Job } from "../interfaces/job.interface";

const jobSchema = new Schema<Job>({
  type: {
    type: String,
    required: true,
    enum: ["email", "report", "image-processing"],
  },
  payload: Schema.Types.Mixed,
  status: {
    type: String,
    enum: ["pending", "running", "completed", "failed"],
    default: "pending",
  },
});

export const JobModel = model("jobs", jobSchema);
