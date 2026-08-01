import config from "../src/config";
import { buildImageProcessor } from "../src/proccessors/image-proccessor";
import { StorageProvider } from "../src/storage/storage-provider.interface";

describe("buildImageProcessor", () => {
  let storageProvider: jest.Mocked<StorageProvider>;

  beforeEach(() => {
    storageProvider = {
      ensureBucketExists: jest.fn(),
      upload: jest.fn(),
    };
  });

  it("ensures the bucket exists then uploads", async () => {
    const processor = buildImageProcessor(storageProvider);

    await processor("path/file.png", "data-url");

    expect(storageProvider.ensureBucketExists).toHaveBeenCalledWith(
      config.bucketName,
    );
    expect(storageProvider.upload).toHaveBeenCalledWith(
      config.bucketName,
      "path/file.png",
      "data-url",
    );
  });

  it("throws when the storage provider fails", async () => {
    storageProvider.ensureBucketExists.mockRejectedValue(
      new Error("storage error"),
    );

    const processor = buildImageProcessor(storageProvider);

    await expect(processor("path/file.png", "data-url")).rejects.toThrow(
      "storage error",
    );
  });
});
