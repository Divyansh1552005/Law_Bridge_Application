import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import mongoSanitize from "./middleware/mongoSanitize.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import LawyerRouter from "./routes/lawyerRoute.js";
import videoRouter from "./routes/videoRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import AuthRouter from "./routes/authRoute.js";
import documentRouter from "./routes/documentRoute.js";
import { connectMongoDB } from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { setupSwagger } from "./config/swagger.js";
import "./bullmq/workers/videoWorker.js";
import "./bullmq/workers/emailWorker.js";
import "./bullmq/workers/maintenanceWorker.js";
import { scheduleMaintenanceJobs } from "./bullmq/jobs/maintenanceJobs.js";

const app = express();
const PORT = process.env.PORT || 3000;
setupSwagger(app);

// for development
// app.use(cors({
//   origin: true, // Allow all origins in development
//   credentials: true
// }));

// CORS configuration - must be first
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (OAuth redirects, mobile apps, Postman)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Security headers
app.use(helmet());

// json middleware
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Strip $ and . from request body/params to prevent MongoDB operator injection
app.use(mongoSanitize());

/*
  trust proxy configuration

  When your app runs behind a reverse proxy (like Nginx, Render, Railway, Vercel, etc.),
  the real client IP is forwarded using the "X-Forwarded-For" header.

  By default, Express does NOT trust that header for security reasons.
  So req.ip would show the proxy's IP instead of the actual client IP.

  Setting trust proxy to 1 tells Express:

  - Trust the first proxy in front of this app
  - Use X-Forwarded-For to determine the real client IP
  - Make req.ip return the correct client IP address

  This is REQUIRED for correct rate limiting in production environments.
*/
app.set("trust proxy", 1);

/*
  Global rate limiter

  This applies to ALL incoming requests.
  Every request must pass this limiter before reaching route-specific handlers.

  Example:
  - Limit: 200 requests
  - Window: 60 seconds
  - Scope: Per IP address

  If a client exceeds 200 requests within 60 seconds,
  all further requests will be blocked until the window resets.
*/
app.use(rateLimiter(200, 60));

connectMongoDB(process.env.MONGODB_URI).then(() =>
  console.log("Mongo DB Connected!!"),
);
connectCloudinary().then(() => console.log("Cloudinary Connected!!"));

scheduleMaintenanceJobs().catch((err) =>
  console.error("Failed to schedule maintenance jobs:", err.message),
);

// api endpoints
app.use("/api/auth", AuthRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/lawyer", LawyerRouter);
app.use("/api/video", videoRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/documents", documentRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

app.get("/health2", (req, res) => {
  res.status(200).send("Server is healthy");
});

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
