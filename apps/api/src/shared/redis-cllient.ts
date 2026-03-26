import { createRedisClient } from "@job-service/shared";
import config from "../config";

const redisClient = createRedisClient(config.redisUrl);

export { redisClient };
