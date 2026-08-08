import { Queue } from "bullmq";
import redis from "../../config/redis.js";

export const maintenanceQueue = new Queue("maintenance", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
