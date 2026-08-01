export default {
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/job-service",
  bucketName:
    process.env.STORAGE_BUCKET_NAME ||
    process.env.AWS_BUCKET_NAME ||
    "media-bucket",

  // Selects the active storage backend: "s3" | "gcs" | "azure" | "local"
  storageProvider: process.env.STORAGE_PROVIDER || "s3",

  // Local filesystem
  localStoragePath: process.env.LOCAL_STORAGE_PATH || "./storage",

  // AWS S3
  s3Endpoint: process.env.S3_ENDPOINT || "http://localhost:4566",
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",

  // Google Cloud Storage
  gcsProjectId: process.env.GCS_PROJECT_ID,
  gcsKeyFilename: process.env.GCS_KEY_FILE,
  gcsApiEndpoint: process.env.GCS_API_ENDPOINT,

  // Azure Blob Storage
  azureStorageConnectionString:
    process.env.AZURE_STORAGE_CONNECTION_STRING || "UseDevelopmentStorage=true",

  workerConcurrency: process.env.WORKER_CONCURRENCY
    ? Number(process.env.WORKER_CONCURRENCY)
    : 5,
  mailHost: process.env.MAIL_HOST || "localhost",
  mailPort: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 1025,
  mailUser: process.env.MAIL_USER || "user",
  mailPassword: process.env.MAIL_PASSWORD || "pass",
  mailSender: process.env.MAIL_SENDER || '"Example Team" <team@example.com>',
};
