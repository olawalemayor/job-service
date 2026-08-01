import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { buildS3StorageProvider } from "../src/storage/s3-storage-provider";

describe("s3StorageProvider", () => {
  let sendMock: jest.Mock;
  let s3Client: S3Client;

  beforeEach(() => {
    sendMock = jest.fn();
    s3Client = { send: sendMock } as unknown as S3Client;
  });

  describe("ensureBucketExists", () => {
    it("does nothing when the bucket already exists", async () => {
      sendMock.mockResolvedValueOnce({ Buckets: [{ Name: "media-bucket" }] });

      const provider = buildS3StorageProvider(s3Client);
      await provider.ensureBucketExists("media-bucket");

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock.mock.calls[0][0]).toBeInstanceOf(ListBucketsCommand);
      expect(sendMock).not.toHaveBeenCalledWith(expect.any(CreateBucketCommand));
    });

    it("creates the bucket with the given name when it does not exist", async () => {
      sendMock.mockResolvedValueOnce({ Buckets: [] }).mockResolvedValueOnce({});

      const provider = buildS3StorageProvider(s3Client);
      await provider.ensureBucketExists("media-bucket");

      expect(sendMock).toHaveBeenCalledTimes(2);
      expect(sendMock.mock.calls[0][0]).toBeInstanceOf(ListBucketsCommand);
      expect(sendMock.mock.calls[1][0]).toBeInstanceOf(CreateBucketCommand);
      expect(sendMock.mock.calls[1][0].input).toEqual({ Bucket: "media-bucket" });
    });

    it("creates the bucket when Buckets is undefined", async () => {
      sendMock.mockResolvedValueOnce({}).mockResolvedValueOnce({});

      const provider = buildS3StorageProvider(s3Client);
      await provider.ensureBucketExists("media-bucket");

      expect(sendMock.mock.calls[1][0]).toBeInstanceOf(CreateBucketCommand);
    });

    it("propagates errors from listing buckets", async () => {
      sendMock.mockRejectedValue(new Error("S3 error"));

      const provider = buildS3StorageProvider(s3Client);

      await expect(provider.ensureBucketExists("media-bucket")).rejects.toThrow(
        "S3 error",
      );
      expect(sendMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("upload", () => {
    it("puts the object to the bucket with the given key and body", async () => {
      sendMock.mockResolvedValueOnce({});

      const provider = buildS3StorageProvider(s3Client);
      await provider.upload("media-bucket", "path/file.png", "data-url");

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
      expect(sendMock.mock.calls[0][0].input).toEqual({
        Bucket: "media-bucket",
        Key: "path/file.png",
        Body: "data-url",
      });
    });

    it("propagates errors from the client", async () => {
      sendMock.mockRejectedValue(new Error("S3 error"));

      const provider = buildS3StorageProvider(s3Client);

      await expect(
        provider.upload("media-bucket", "path/file.png", "data-url"),
      ).rejects.toThrow("S3 error");
    });
  });
});
