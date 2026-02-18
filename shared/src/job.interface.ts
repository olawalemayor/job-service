export interface Job {
  _id: string;
  type: JobType;
  payload: Record<string, any>;
  status: JobStatus;
  createdAt: Date;
  updatedAt?: Date;
  result?: any;
  error?: string;
}

export type JobType = "email" | "report" | "image-processing";

export type JobStatus = "pending" | "running" | "completed" | "failed";
