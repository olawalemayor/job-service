import { createClient } from "redis";

export function createRedisClient(url: string) {
  const client = createClient({ url });
  client.on("error", (err) => console.log("Redis Client Error", err));
  return client;
}
