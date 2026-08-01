import { Storage } from "@google-cloud/storage";
import { buildGcsStorageProvider } from "../src/storage/gcs-storage-provider";

describe("gcsStorageProvider", () => {
  let existsMock: jest.Mock;
  let createBucketMock: jest.Mock;
  let saveMock: jest.Mock;
  let fileMock: jest.Mock;
  let bucketMock: jest.Mock;
  let storage: Storage;

  beforeEach(() => {
    existsMock = jest.fn();
    saveMock = jest.fn();
    createBucketMock = jest.fn();
    fileMock = jest.fn(() => ({ save: saveMock }));
    bucketMock = jest.fn(() => ({ exists: existsMock, file: fileMock }));

    storage = {
      bucket: bucketMock,
      createBucket: createBucketMock,
    } as unknown as Storage;
  });

  describe("ensureBucketExists", () => {
    it("does nothing when the bucket already exists", async () => {
      existsMock.mockResolvedValue([true]);

      const provider = buildGcsStorageProvider(storage);
      await provider.ensureBucketExists("media-bucket");

      expect(bucketMock).toHaveBeenCalledWith("media-bucket");
      expect(createBucketMock).not.toHaveBeenCalled();
    });

    it("creates the bucket when it does not exist", async () => {
      existsMock.mockResolvedValue([false]);

      const provider = buildGcsStorageProvider(storage);
      await provider.ensureBucketExists("media-bucket");

      expect(createBucketMock).toHaveBeenCalledWith("media-bucket");
      expect(createBucketMock).toHaveBeenCalledTimes(1);
    });

    it("propagates errors from checking existence", async () => {
      existsMock.mockRejectedValue(new Error("GCS error"));

      const provider = buildGcsStorageProvider(storage);

      await expect(provider.ensureBucketExists("media-bucket")).rejects.toThrow(
        "GCS error",
      );
      expect(createBucketMock).not.toHaveBeenCalled();
    });
  });

  describe("upload", () => {
    it("saves the body to the bucket file", async () => {
      const provider = buildGcsStorageProvider(storage);
      await provider.upload("media-bucket", "path/file.png", "data-url");

      expect(bucketMock).toHaveBeenCalledWith("media-bucket");
      expect(fileMock).toHaveBeenCalledWith("path/file.png");
      expect(saveMock).toHaveBeenCalledWith("data-url");
    });

    it("propagates errors from the client", async () => {
      saveMock.mockRejectedValue(new Error("GCS error"));

      const provider = buildGcsStorageProvider(storage);

      await expect(
        provider.upload("media-bucket", "path/file.png", "data-url"),
      ).rejects.toThrow("GCS error");
    });
  });
});
