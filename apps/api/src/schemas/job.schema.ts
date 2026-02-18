import { model, Schema } from "mongoose";
import { redisClient, Job } from "@job-service/shared";

const jobSchema = new Schema<Job>(
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
  },
  { timestamps: true },
);

jobSchema.pre("save", async function (next) {
  if (this.isNew) {
    await redisClient.lPush("job_queue", JSON.stringify({ jobId: this._id }));
  }
});

export const JobModel = model("jobs", jobSchema);
