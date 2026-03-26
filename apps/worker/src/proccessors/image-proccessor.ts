import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import config from "../config";

export const buildImageProcessor = (s3Client: S3Client) => {
  return async (path: string, dataUrl: string) => {
    const bucketsResponse = await s3Client.send(new ListBucketsCommand({}));

    const exists = bucketsResponse.Buckets?.some(
      (b) => b.Name === config.bucketName,
    );

    if (!exists) {
      await s3Client.send(
        new CreateBucketCommand({ Bucket: config.bucketName }),
      );
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: path,
        Body: dataUrl,
      }),
    );
  };
};

const s3Client = new S3Client({
  region: config.awsRegion,
  endpoint: config.s3Endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

export const imageProccessor = buildImageProcessor(s3Client);
