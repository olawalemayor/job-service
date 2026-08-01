import { Storage } from "@google-cloud/storage";
import { StorageProvider } from "./storage-provider.interface";
import config from "../config";

export const buildGcsStorageProvider = (storage: Storage): StorageProvider => ({
  async ensureBucketExists(bucketName: string) {
    const [exists] = await storage.bucket(bucketName).exists();

    if (!exists) {
      await storage.createBucket(bucketName);
    }
  },

  async upload(bucketName: string, key: string, body: string) {
    await storage.bucket(bucketName).file(key).save(body);
  },
});

export const createGcsStorageProvider = (): StorageProvider => {
  const storage = new Storage({
    ...(config.gcsProjectId && { projectId: config.gcsProjectId }),
    ...(config.gcsKeyFilename && { keyFilename: config.gcsKeyFilename }),
    ...(config.gcsApiEndpoint && { apiEndpoint: config.gcsApiEndpoint }),
  });

  return buildGcsStorageProvider(storage);
};
