import { StorageProvider } from "./storage-provider.interface";
import { createS3StorageProvider } from "./s3-storage-provider";
import { createGcsStorageProvider } from "./gcs-storage-provider";
import { createAzureStorageProvider } from "./azure-storage-provider";
import { createLocalStorageProvider } from "./local-storage-provider";
import config from "../config";

export const createStorageProvider = (): StorageProvider => {
  switch (config.storageProvider) {
    case "gcs":
      return createGcsStorageProvider();
    case "azure":
      return createAzureStorageProvider();
    case "s3":
      return createS3StorageProvider();
    case "local":
      return createLocalStorageProvider();
    default:
      throw new Error(`Unsupported STORAGE_PROVIDER: ${config.storageProvider}`);
  }
};
