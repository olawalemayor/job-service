export default {
  serverPort: process.env.PORT || 6500,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/job-service",
};
