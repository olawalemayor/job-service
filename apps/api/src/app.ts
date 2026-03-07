import Express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import jobsRouter from "./routes/jobs.route";
import bodyParser from "body-parser";
import config from "./config";
import mongoose from "mongoose";
import { redisClient } from "./shared/redis-cllient";

const app = Express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.get("/health", (req, res) => {
  res.status(200).send({ message: "OK" });
});

app.use("/jobs", jobsRouter);

const connectToDb = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

app.listen(Number(config.serverPort), async () => {
  try {
    await redisClient.connect();
    await connectToDb();

    console.log("Successfully connected to redis");

    console.log(`Server listening at port ${config.serverPort}`);
  } catch (error: any) {
    await redisClient.quit();
    console.log("Error starting server", error.message || error);
  }
});
