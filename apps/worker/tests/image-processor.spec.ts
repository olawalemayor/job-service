import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../src/config";
import { buildImageProcessor } from "../src/proccessors/image-proccessor";

describe("buildImageProcessor", () => {
  let sendMock: jest.Mock;
  let s3Client: S3Client;

  beforeEach(() => {
    sendMock = jest.fn();
    s3Client = { send: sendMock } as unknown as S3Client;
  });

  it("uploads when bucket exists", async () => {
    sendMock
      .mockResolvedValueOnce({
        Buckets: [{ Name: config.bucketName }],
      })
      .mockResolvedValueOnce({});

    const processor = buildImageProcessor(s3Client);

    await processor("path/file.png", "data-url");

    expect(sendMock).toHaveBeenCalledWith(expect.any(ListBucketsCommand));

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));

    expect(sendMock).not.toHaveBeenCalledWith(expect.any(CreateBucketCommand));
  });

  it("creates bucket if it does not exist", async () => {
    sendMock
      .mockResolvedValueOnce({ Buckets: [] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    const processor = buildImageProcessor(s3Client);

    await processor("path/file.png", "data-url");

    expect(sendMock).toHaveBeenCalledWith(expect.any(CreateBucketCommand));

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it("creates bucket when buckets is undefined", async () => {
    sendMock
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    const processor = buildImageProcessor(s3Client);

    await processor("path/file.png", "data-url");

    expect(sendMock).toHaveBeenCalledWith(expect.any(CreateBucketCommand));

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it("throws error when S3 fails", async () => {
    sendMock.mockRejectedValue(new Error("S3 error"));

    const processor = buildImageProcessor(s3Client);

    await expect(processor("path/file.png", "data-url")).rejects.toThrow(
      "S3 error",
    );
  });
});
