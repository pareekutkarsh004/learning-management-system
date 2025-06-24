// server/index.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectMongoose from "./configs/mongoose.js";
import connectCloudinary from "./configs/cloudinary.js";
import { createGridFSBucket } from "./utils/gridfs.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHooks.js";
import educatorRouter from "./route/educatorRoutes.js";
import courseRouter from "./route/courseRoute.js";
import userRouter from "./route/userRoutes.js";
import { requireAuth } from '@clerk/clerk-sdk-node';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- 1. Connect DBs ----------
await connectMongoose();
console.log("✅ MongoDB connected");

await connectCloudinary();
console.log("✅ Cloudinary connected");

const bucket = await createGridFSBucket();
console.log("✅ GridFS initialized");

// ---------- 2. Global Middleware ----------
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// ---------- 3. Debug Route (Optional) ----------
app.get("/debug-auth", (req, res) => {
  console.log("🔑 Clerk Auth Payload:", req.auth);
  res.json({ message: "Clerk auth payload logged" });
});

// ---------- 4. Routes ----------
app.get("/", (req, res) => res.send("✅ API working"));

app.post("/clerk", clerkWebhooks); // Clerk webhook uses express.json() (already applied)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks); // Stripe requires raw body

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// ---------- 5. Serve GridFS Assets ----------
app.get("/assets/:filename", (req, res) => {
  if (!bucket) return res.status(500).send("GridFS not initialized");

  const stream = bucket.openDownloadStreamByName(req.params.filename);
  stream.on("error", () => res.status(404).send("File not found"));
  res.setHeader("Cache-Control", "public, max-age=31536000");
  stream.pipe(res);
});

// ---------- 6. Global Error Handler (Optional) ----------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ---------- 7. Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
