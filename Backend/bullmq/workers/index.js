import "dotenv/config";
import { connectMongoDB } from "../../config/mongodb.js";

// videoWorker.js and maintenanceWorker.js query Mongoose models, so this
// standalone entrypoint (npm run worker) needs its own DB connection —
// unlike importing these workers from server.js, where the connection
// already exists.
await connectMongoDB(process.env.MONGODB_URI);
console.log("Mongo DB Connected in worker process!!");

await import("./videoWorker.js");
await import("./emailWorker.js");
await import("./maintenanceWorker.js");

const { scheduleMaintenanceJobs } = await import("../jobs/maintenanceJobs.js");
scheduleMaintenanceJobs().catch((err) =>
  console.error("Failed to schedule maintenance jobs:", err.message),
);
