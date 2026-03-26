import { model } from "mongoose";
import { createJobSchema } from "@job-service/shared";
import { redisClient } from "../shared/redis-cllient";

const jobSchema = createJobSchema();

jobSchema.pre("save", async function (next) {
  if (this.isNew) {
    await redisClient.lPush("job_queue", JSON.stringify({ jobId: this._id }));
  }
});

export const JobModel = model("jobs", jobSchema);
