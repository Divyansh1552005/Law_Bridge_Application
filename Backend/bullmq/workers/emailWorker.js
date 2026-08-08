import { Worker } from "bullmq";
import redis from "../../config/redis.js";
import { sendEmail } from "../../services/mailService.js";

const worker = new Worker(
  "email",
  async (job) => {
    if (job.name === "send-email") {
      const { to, subject, html } = job.data;
      console.log(`[Job ${job.id}] Sending email to: ${to}`);
      await sendEmail({ to, subject, html });
      console.log(`[Job ${job.id}] Email sent to: ${to}`);
    }
  },
  {
    connection: redis,
    concurrency: 5,
    removeOnComplete: true,
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
);

worker.on("failed", (job, err) => {
  console.error(`[Job ${job?.id}] Email job failed:`, err.message);
});

export default worker;
