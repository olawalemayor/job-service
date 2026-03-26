import { Schema } from "mongoose";
import type { Job } from "../interfaces/job.interface";

export function createJobSchema(): Schema<Job> {
  return new Schema<Job>(
    {
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
      result: Schema.Types.Mixed,
      error: { type: String },
    },
    { timestamps: true },
  );
}
