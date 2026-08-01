import { BlobServiceClient } from "@azure/storage-blob";
import { StorageProvider } from "./storage-provider.interface";
import config from "../config";

export const buildAzureStorageProvider = (
  blobServiceClient: BlobServiceClient,
): StorageProvider => ({
  async ensureBucketExists(bucketName: string) {
    const containerClient = blobServiceClient.getContainerClient(bucketName);

    if (!(await containerClient.exists())) {
      await containerClient.create();
    }
  },

  async upload(bucketName: string, key: string, body: string) {
    const containerClient = blobServiceClient.getContainerClient(bucketName);
    const blockBlobClient = containerClient.getBlockBlobClient(key);
    await blockBlobClient.upload(body, Buffer.byteLength(body));
  },
});

export const createAzureStorageProvider = (): StorageProvider => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.azureStorageConnectionString,
  );

  return buildAzureStorageProvider(blobServiceClient);
};
