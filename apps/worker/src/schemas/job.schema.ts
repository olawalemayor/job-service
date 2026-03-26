import { model } from "mongoose";
import { createJobSchema } from "@job-service/shared";

export const JobModel = model("jobs", createJobSchema());
