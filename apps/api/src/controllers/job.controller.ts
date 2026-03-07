import { RequestHandler } from "express";
import { jobValidationSchema } from "../models/job";
import { JobModel } from "../schemas/job.schema";
import { Job } from "../interfaces/job.interface";

export const createJob: RequestHandler<
  null,
  { jobId: string } | { message: string },
  Omit<Job, "status">
> = async (req, res) => {
  try {
    const { error, value } = await jobValidationSchema.validate(req.body);

    if (error) return res.status(400).send({ message: error.message });

    const newJob = new JobModel(value);

    await newJob.save();

    res.status(201).send({ jobId: newJob.id });
  } catch (error: any) {
    res.status(500).send({ message: error.message || (error as string) });
  }
};

export const getAllJobs: RequestHandler<
  null,
  Job[] | { message: string }
> = async (req, res) => {
  try {
    const allJobs = await JobModel.find();

    res.status(200).send(allJobs);
  } catch (error: any) {
    res.status(500).send({ message: error.message || (error as string) });
  }
};

export const getJobStatus: RequestHandler<
  { id: string },
  { status: Job["status"] } | { message: string }
> = async (req, res) => {
  try {
    const specifiedJob = await JobModel.findById(req.params.id);

    if (!specifiedJob)
      return res.status(404).send({ message: "Job not found" });

    res.status(200).send({ status: specifiedJob.status });
  } catch (error: any) {
    res.status(500).send({ message: error.message || (error as string) });
  }
};

export const deleteJob: RequestHandler<
  { id: string },
  Job | { message: string }
> = async (req, res) => {
  try {
    const specifiedJob = await JobModel.findById(req.params.id);

    if (!specifiedJob)
      return res.status(404).send({ message: "Job not found" });

    await JobModel.deleteOne({ _id: specifiedJob._id });

    res.status(200).send(specifiedJob);
  } catch (error: any) {
    res.status(500).send({ message: error.message || (error as string) });
  }
};
