// server/index.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectMongoose from "./configs/mongoose.js"; // ✅ use mongoose for model-based querying
import connectCloudinary from "./configs/cloudinary.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHooks.js";
import { clerkMiddleware } from "@clerk/express";
import educatorRouter from "./route/educatorRoutes.js";
import courseRouter from "./route/courseRoute.js";
import userRouter from "./route/userRoutes.js";
import { createGridFSBucket } from "./utils/gridfs.js"; // ✅ new file to handle GridFS

const app = express();
const PORT = process.env.PORT || 5000;

// Connect database (Mongoose) & Cloudinary
await connectMongoose();
await connectCloudinary();

// GridFS bucket (set up after DB connection)
const bucket = await createGridFSBucket(); // returns a GridFSBucket instance

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Serve assets from GridFS
app.get("/assets/:filename", (req, res) => {
  if (!bucket) return res.status(500).send("GridFS not initialized");
A
  const stream = bucket.openDownloadStreamByName(req.params.filename);
  stream.on("error", () => res.status(404).send("File not found"));
  res.setHeader("Cache-Control", "public, max-age=31536000");
  stream.pipe(res);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
