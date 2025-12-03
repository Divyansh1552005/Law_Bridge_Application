import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import LawyerRouter from "./routes/lawyerRoute.js";
import videoRouter from "./routes/videoRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { connectMongoDB } from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import rateLimit from "express-rate-limit";


const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - must be first
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));

// json middleware
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // each IP gets 100 requests ie about 7 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, try again later.",
});

app.use(limiter);



// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

connectMongoDB(process.env.MONGODB_URI).then(()=> console.log("Mongo DB Connected!!"));
connectCloudinary().then(()=> console.log("Cloudinary Connected!!"));


// api endpoints
app.use("/api/user", userRouter); 
app.use("/api/admin", adminRouter);
app.use("/api/lawyer", LawyerRouter);
app.use("/api/video", videoRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

app.get('/health2', (req, res) => {
  res.status(200).send('Server is healthy');
});

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
