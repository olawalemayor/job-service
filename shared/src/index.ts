if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing in .env");
}

if (!process.env.DB_URL) {
  throw new Error("DB_URL is missing in .env");
}

export * from "./config";
export * from "./redis-client";
export * from "./db-client";
export * from "./job.interface";
