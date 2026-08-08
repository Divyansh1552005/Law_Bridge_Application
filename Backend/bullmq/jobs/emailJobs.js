import { emailQueue } from "../queues/emailQueue.js";

// job producer file — request handlers enqueue instead of sending inline,
// so the HTTP response doesn't block on the Brevo API call
export const queueEmail = async ({ to, subject, html }) => {
  return emailQueue.add("send-email", { to, subject, html });
};
