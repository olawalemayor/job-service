import Express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import jobsRouter from "./routes/jobs.route";
import bodyParser from "body-parser";
import { redisClient, connectToDb } from "@job-service/shared";

const app = Express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.get("/health", (req, res) => {
  res.status(200).send({ message: "OK" });
});

app.use("/jobs", jobsRouter);

app.listen(6500, async () => {
  try {
    await redisClient.connect();
    await connectToDb();

    console.log("Successfully connected to redis");

    console.log(`Server listening at port ${6500}`);
  } catch (error: any) {
    await redisClient.quit();
    console.log("Error starting server", error.message || error);
  }
});
