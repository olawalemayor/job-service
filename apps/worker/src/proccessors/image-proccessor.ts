import { StorageProvider } from "../storage/storage-provider.interface";
import { createStorageProvider } from "../storage/storage-provider.factory";
import config from "../config";

export const buildImageProcessor = (storageProvider: StorageProvider) => {
  return async (path: string, dataUrl: string) => {
    await storageProvider.ensureBucketExists(config.bucketName);
    await storageProvider.upload(config.bucketName, path, dataUrl);
  };
};

export const imageProccessor = buildImageProcessor(createStorageProvider());
