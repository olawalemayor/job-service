import { redisClient, connectToDb } from "@job-service/shared";
import { JobModel } from "./schemas/job.schema";
import { emailProcessor } from "./proccessors/email-processor";
import { imageProccessor } from "./proccessors/image-proccessor";
import { reportProccessor } from "./proccessors/report-proccessor";

async function startWorker() {
  await redisClient.connect();
  await connectToDb();

  console.log("Worker started, waiting for jobs...");

  // Infinite loop to keep popping
  while (true) {
    try {
      const jobData = await redisClient.brPop("job_queue", 0);

      if (jobData) {
        const toProccess = JSON.parse(jobData.element) as { jobId: string };

        const job = await JobModel.findById(toProccess.jobId);

        if (job) {
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

            default:
              break;
          }

          await JobModel.deleteOne({ _id: job._id });
        }
      }
    } catch (err) {
      console.error("Redis Error:", err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

startWorker();
