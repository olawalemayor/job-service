import { BlobServiceClient } from "@azure/storage-blob";
import { buildAzureStorageProvider } from "../src/storage/azure-storage-provider";

describe("azureStorageProvider", () => {
  let existsMock: jest.Mock;
  let createMock: jest.Mock;
  let uploadMock: jest.Mock;
  let getBlockBlobClientMock: jest.Mock;
  let getContainerClientMock: jest.Mock;
  let blobServiceClient: BlobServiceClient;

  beforeEach(() => {
    existsMock = jest.fn();
    createMock = jest.fn();
    uploadMock = jest.fn();
    getBlockBlobClientMock = jest.fn(() => ({ upload: uploadMock }));
    getContainerClientMock = jest.fn(() => ({
      exists: existsMock,
      create: createMock,
      getBlockBlobClient: getBlockBlobClientMock,
    }));

    blobServiceClient = {
      getContainerClient: getContainerClientMock,
    } as unknown as BlobServiceClient;
  });

  describe("ensureBucketExists", () => {
    it("does nothing when the container already exists", async () => {
      existsMock.mockResolvedValue(true);

      const provider = buildAzureStorageProvider(blobServiceClient);
      await provider.ensureBucketExists("media-bucket");

      expect(getContainerClientMock).toHaveBeenCalledWith("media-bucket");
      expect(createMock).not.toHaveBeenCalled();
    });

    it("creates the container when it does not exist", async () => {
      existsMock.mockResolvedValue(false);

      const provider = buildAzureStorageProvider(blobServiceClient);
      await provider.ensureBucketExists("media-bucket");

      expect(createMock).toHaveBeenCalledTimes(1);
    });

    it("propagates errors from checking existence", async () => {
      existsMock.mockRejectedValue(new Error("Azure error"));

      const provider = buildAzureStorageProvider(blobServiceClient);

      await expect(provider.ensureBucketExists("media-bucket")).rejects.toThrow(
        "Azure error",
      );
      expect(createMock).not.toHaveBeenCalled();
    });
  });

  describe("upload", () => {
    it("uploads the body to the blob", async () => {
      const provider = buildAzureStorageProvider(blobServiceClient);
      await provider.upload("media-bucket", "path/file.png", "data-url");

      expect(getBlockBlobClientMock).toHaveBeenCalledWith("path/file.png");
      expect(uploadMock).toHaveBeenCalledWith(
        "data-url",
        Buffer.byteLength("data-url"),
      );
    });

    it("propagates errors from the client", async () => {
      uploadMock.mockRejectedValue(new Error("Azure error"));

      const provider = buildAzureStorageProvider(blobServiceClient);

      await expect(
        provider.upload("media-bucket", "path/file.png", "data-url"),
      ).rejects.toThrow("Azure error");
    });
  });
});
