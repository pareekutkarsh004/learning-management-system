// server/index.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB, { bucket } from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHooks.js";
import educatorRouter from "./route/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./route/courseRoute.js";
import userRouter from "./route/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
await connectCloudinary();

app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("API working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// GridFS asset serving route
app.get("/assets/:filename", (req, res) => {
  if (!bucket) return res.status(500).send("GridFS not initialized");

  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
  downloadStream.on("error", () => res.status(404).send("File not found"));
  res.setHeader("Cache-Control", "public, max-age=31536000");
  downloadStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
