import { Request, Response } from "express";
import {
  createJob,
  getAllJobs,
  getJobStatus,
  deleteJob,
} from "../src/controllers/job.controller";
import { JobModel } from "../src/schemas/job.schema";
import { jobValidationSchema } from "../src/models/job";

jest.mock("../schemas/job.schema");
jest.mock("../models/job");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Job Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("should create a job successfully", async () => {
      const req = {
        body: { name: "Test Job" },
      } as Request<any>;

      const res = mockResponse();

      (jobValidationSchema.validate as jest.Mock).mockResolvedValue({
        value: req.body,
      });

      const saveMock = jest.fn().mockResolvedValue({});
      (JobModel as unknown as jest.Mock).mockImplementation(() => ({
        save: saveMock,
        id: "123",
      }));

      await createJob(req, res, jest.fn());

      expect(jobValidationSchema.validate).toHaveBeenCalledWith(req.body);
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ jobId: "123" });
    });

    it("should return 400 if validation fails", async () => {
      const req = {
        body: {},
      } as Request<any>;

      const res = mockResponse();

      (jobValidationSchema.validate as jest.Mock).mockResolvedValue({
        error: { message: "Validation error" },
      });

      await createJob(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Validation error",
      });
    });

    it("should return 500 on error", async () => {
      const req = {
        body: { name: "Test Job" },
      } as Request<any>;

      const res = mockResponse();

      (jobValidationSchema.validate as jest.Mock).mockRejectedValue(
        new Error("Something broke"),
      );

      await createJob(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Something broke",
      });
    });
  });

  describe("getAllJobs", () => {
    it("should return all jobs", async () => {
      const req = {} as Request<any>;
      const res = mockResponse();

      const jobs = [{ id: "1" }, { id: "2" }];
      (JobModel.find as jest.Mock).mockResolvedValue(jobs);

      await getAllJobs(req, res, jest.fn());

      expect(JobModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(jobs);
    });

    it("should return 500 on error", async () => {
      const req = {} as Request<any>;
      const res = mockResponse();

      (JobModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

      await getAllJobs(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "DB error",
      });
    });
  });

  describe("getJobStatus", () => {
    it("should return job status", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      (JobModel.findById as jest.Mock).mockResolvedValue({
        status: "completed",
      });

      await getJobStatus(req, res, jest.fn());

      expect(JobModel.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        status: "completed",
      });
    });

    it("should return 404 if job not found", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      (JobModel.findById as jest.Mock).mockResolvedValue(null);

      await getJobStatus(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Job not found",
      });
    });

    it("should return 500 on error", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      (JobModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await getJobStatus(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteJob", () => {
    it("should delete job successfully", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      const job = { _id: "123", name: "Test Job" };

      (JobModel.findById as jest.Mock).mockResolvedValue(job);
      (JobModel.deleteOne as jest.Mock).mockResolvedValue({});

      await deleteJob(req, res, jest.fn());

      expect(JobModel.deleteOne).toHaveBeenCalledWith({ _id: "123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(job);
    });

    it("should return 404 if job not found", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      (JobModel.findById as jest.Mock).mockResolvedValue(null);

      await deleteJob(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Job not found",
      });
    });

    it("should return 500 on error", async () => {
      const req = {
        params: { id: "123" },
      } as unknown as Request<any>;

      const res = mockResponse();

      (JobModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await deleteJob(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
