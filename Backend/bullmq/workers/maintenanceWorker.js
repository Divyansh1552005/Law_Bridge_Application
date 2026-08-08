import { Worker } from "bullmq";
import redis from "../../config/redis.js";
import userModel from "../../models/userModel.js";
import appointmentModel from "../../models/appointmentModel.js";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Stale email-verification / password-reset / delete-OTP tokens sitting on
// userModel forever. NOT a TTL index — a TTL index deletes the WHOLE
// document once the date passes, and these fields live on the user account
// document itself, so that would delete user accounts. This sweep only
// $unsets the specific expired fields, keeping the account intact.
export const cleanupExpiredTokens = async () => {
  const now = new Date();

  const [emailResult, resetResult, otpResult] = await Promise.all([
    userModel.updateMany(
      { emailVerificationExpiry: { $lt: now } },
      { $unset: { emailVerificationToken: "", emailVerificationExpiry: "" } },
    ),
    userModel.updateMany(
      { resetPasswordExpiry: { $lt: now } },
      { $unset: { resetPasswordToken: "", resetPasswordExpiry: "" } },
    ),
    userModel.updateMany(
      { deleteOtpExpiresAt: { $lt: now } },
      { $unset: { deleteOtp: "", deleteOtpExpiresAt: "" } },
    ),
  ]);

  console.log(
    `[cleanup-expired-tokens] cleared — email: ${emailResult.modifiedCount}, reset: ${resetResult.modifiedCount}, deleteOtp: ${otpResult.modifiedCount}`,
  );
};

// Flag (never delete) old cancelled/completed appointments so operational
// dashboards don't have to keep scanning years of history. Financial/dispute
// records stay in the DB — this only affects default listing queries.
export const archiveOldAppointments = async () => {
  const cutoff = new Date(Date.now() - ONE_YEAR_MS);

  const result = await appointmentModel.updateMany(
    {
      archived: { $ne: true },
      createdAt: { $lt: cutoff },
      $or: [
        { cancelled: { $nin: ["Not Cancelled", false, null] } },
        { isCompleted: true },
      ],
    },
    { $set: { archived: true } },
  );

  console.log(`[archive-old-appointments] archived: ${result.modifiedCount}`);
};

const worker = new Worker(
  "maintenance",
  async (job) => {
    if (job.name === "cleanup-expired-tokens") {
      await cleanupExpiredTokens();
    } else if (job.name === "archive-old-appointments") {
      await archiveOldAppointments();
    }
  },
  {
    connection: redis,
    concurrency: 2,
    removeOnComplete: true,
    removeOnFail: { count: 50 },
  },
);

worker.on("failed", (job, err) => {
  console.error(`[Job ${job?.id}] Maintenance job "${job?.name}" failed:`, err.message);
});

export default worker;
