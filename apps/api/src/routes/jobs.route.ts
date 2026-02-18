import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobStatus,
} from "../controllers/job.controller";

const router = Router();

router.post("/", createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobStatus);

router.delete("/:id", deleteJob);

export default router;
