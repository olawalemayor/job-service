import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { StorageProvider } from "./storage-provider.interface";
import config from "../config";

export const buildLocalStorageProvider = (basePath: string): StorageProvider => ({
  async ensureBucketExists(bucketName: string) {
    await mkdir(join(basePath, bucketName), { recursive: true });
  },

  async upload(bucketName: string, key: string, body: string) {
    const filePath = join(basePath, bucketName, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
  },
});

export const createLocalStorageProvider = (): StorageProvider =>
  buildLocalStorageProvider(config.localStoragePath);
