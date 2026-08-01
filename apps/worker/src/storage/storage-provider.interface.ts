export interface StorageProvider {
  ensureBucketExists(bucketName: string): Promise<void>;
  upload(bucketName: string, key: string, body: string): Promise<void>;
}
