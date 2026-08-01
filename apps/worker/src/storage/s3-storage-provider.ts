import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { StorageProvider } from "./storage-provider.interface";
import config from "../config";

export const buildS3StorageProvider = (s3Client: S3Client): StorageProvider => ({
  async ensureBucketExists(bucketName: string) {
    const bucketsResponse = await s3Client.send(new ListBucketsCommand({}));

    const exists = bucketsResponse.Buckets?.some((b) => b.Name === bucketName);

    if (!exists) {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    }
  },

  async upload(bucketName: string, key: string, body: string) {
    await s3Client.send(
      new PutObjectCommand({ Bucket: bucketName, Key: key, Body: body }),
    );
  },
});

export const createS3StorageProvider = (): StorageProvider => {
  const s3Client = new S3Client({
    region: config.awsRegion,
    endpoint: config.s3Endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });

  return buildS3StorageProvider(s3Client);
};
