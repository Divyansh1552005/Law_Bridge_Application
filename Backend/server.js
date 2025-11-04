import express from "express";
import "dotenv/config";
import { connectMongoDB } from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";

const app = express();
const PORT = process.env.PORT || 3000;

// json middleware
app.use(express.json());


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
