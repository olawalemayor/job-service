import { load } from "dotenv-mono";
load();

export const config = {
  redisUrl: process.env.REDIS_URL!,
  dbUrl: process.env.DB_URL!,
};
