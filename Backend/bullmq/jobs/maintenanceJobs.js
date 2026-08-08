import { maintenanceQueue } from "../queues/maintenanceQueue.js";

// job producer file — registers repeatable jobs once at server startup.
// BullMQ dedups repeatable jobs by jobId + repeat pattern, so calling this
// again on every restart is a no-op, not a duplicate schedule.
export const scheduleMaintenanceJobs = async () => {
  await maintenanceQueue.add(
    "cleanup-expired-tokens",
    {},
    {
      jobId: "cleanup-expired-tokens",
      repeat: { pattern: "0 3 * * *" }, // daily at 3am
    },
  );

  await maintenanceQueue.add(
    "archive-old-appointments",
    {},
    {
      jobId: "archive-old-appointments",
      repeat: { pattern: "0 3 * * *" }, // daily at 3am
    },
  );

  console.log("Maintenance jobs scheduled: cleanup-expired-tokens, archive-old-appointments");
};
