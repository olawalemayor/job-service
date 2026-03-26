export default {
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/job-service",
  bucketName: process.env.AWS_BUCKET_NAME || "media_bucket",
  mailHost: process.env.MAIL_HOST || "localhost",
  mailPort: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 1025,
  mailUser: process.env.MAIL_USER || "user",
  mailPassword: process.env.MAIL_PASSWORD || "pass",
  mailSender: process.env.MAIL_SENDER || '"Example Team" <team@example.com>',
};
