import { JobModel } from "./schemas/job.schema";
import { emailProcessor } from "./proccessors/email-processor";
import { imageProccessor } from "./proccessors/image-proccessor";
import { reportProccessor } from "./proccessors/report-proccessor";
import { createRedisClient } from "@job-service/shared";
import mongoose from "mongoose";
import "dotenv/config";
import config from "./config";

const QUEUE = "job_queue";

const redisClient = createRedisClient(config.redisUrl);

const connectToDb = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

async function recoverOrphanedJobs() {
  // Reset any jobs that were mid-processing when the worker last crashed
  const { modifiedCount } = await JobModel.updateMany(
    { status: "running" },
    { status: "pending" },
  );

  // Flush the queue and rebuild it from MongoDB — single source of truth
  await redisClient.del([QUEUE, `${QUEUE}:processing`]);

  const pendingJobs = await JobModel.find({ status: "pending" }, { _id: 1 });
  if (pendingJobs.length > 0) {
    const items = pendingJobs.map((j) => JSON.stringify({ jobId: j._id.toString() }));
    await redisClient.lPush(QUEUE, items);
  }

  if (modifiedCount > 0 || pendingJobs.length > 0) {
    console.log(
      `Recovery: reset ${modifiedCount} running job(s), re-queued ${pendingJobs.length} pending job(s)`,
    );
  }
}

async function processJobs() {
  while (true) {
    try {
      const data = await redisClient.brPop(QUEUE, 0);
      if (!data) continue;

      const { jobId } = JSON.parse(data.element) as { jobId: string };

      // Atomically claim the job — skips if already claimed by another worker
      const job = await JobModel.findOneAndUpdate(
        { _id: jobId, status: "pending" },
        { status: "running" },
        { returnDocument: "after" },
      );

      if (!job) continue;

      try {
        switch (job.type) {
          case "email":
            await emailProcessor(
              job.payload.to,
              job.payload.message,
              job.payload.attachments,
            );
            break;
          case "image-processing":
            await imageProccessor(job.payload.path, job.payload.dataUrl);
            break;
          case "report":
            await reportProccessor(job.payload.reportId);
            break;
        }

        await JobModel.findByIdAndUpdate(jobId, { status: "completed" });
      } catch (err: any) {
        await JobModel.findByIdAndUpdate(jobId, {
          status: "failed",
          error: err.message ?? String(err),
        });
      }
    } catch (err) {
      console.error("Worker error:", err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function startWorker() {
  await redisClient.connect();
  await connectToDb();
  await recoverOrphanedJobs();

  console.log(
    `Worker started with concurrency ${config.workerConcurrency}, waiting for jobs...`,
  );

  await Promise.all(
    Array.from({ length: config.workerConcurrency }, () => processJobs()),
  );
}

startWorker();
