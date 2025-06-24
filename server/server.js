<<<<<<< HEAD
console.log("Nodemon is watching...");
import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/mongodb.js"
import clerkWebhooks, { stripeWebhooks } from "./controllers/webHooks.js"
import educatorRouter from "./route/educatorRoutes.js"
import { clerkMiddleware } from "@clerk/express"
import connectCloudinary from "./configs/cloudinary.js"
import courseRouter from "./route/courseRoute.js";
import userRouter from "./route/userRoutes.js";

//Initialize express

const app= express()

//connect database

await connectDB()
await connectCloudinary( )

//Middlewares

app.use(cors())
app.use(clerkMiddleware())  

//Routes
app.get('/',(req,res)=>res.send("API working"))
app.post('/clerk', express.json(),clerkWebhooks)
app.use('/api/educator', express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type: 'application/json'}), stripeWebhooks)


//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`Server is running on port: ${PORT}`)
})
=======
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
import { requireAuth } from "@clerk/express";

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
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Add multiple origins if needed
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply clerkMiddleware to all routes
app.use(clerkMiddleware());

// Apply JSON middleware BEFORE webhook routes that need raw body
app.use("/clerk", express.raw({ type: "application/json" })); // Clerk webhook
app.use("/stripe", express.raw({ type: "application/json" })); // Stripe webhook

// Apply JSON middleware to other routes
app.use((req, res, next) => {
  if (req.path === "/clerk" || req.path === "/stripe") {
    return next();
  }
  express.json()(req, res, next);
});

// ---------- 3. Debug Route (Optional) ----------
app.get("/debug-auth", (req, res) => {
  console.log("🔑 Clerk Auth Payload:", req.auth);
  res.json({
    message: "Clerk auth payload logged",
    auth: req.auth,
    hasUserId: !!req.auth?.userId,
    userId: req.auth?.userId,
  });
});

// ---------- 4. Routes ----------
app.get("/", (req, res) => res.send("✅ API working"));

// Webhook routes (these need raw body, not JSON)
app.post("/clerk", clerkWebhooks);
app.post("/stripe", stripeWebhooks);

// API routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);

// User routes with authentication
app.use("/api/user", requireAuth(), userRouter);

// ---------- 5. Serve GridFS Assets ----------
app.get("/assets/:filename", (req, res) => {
  if (!bucket) return res.status(500).send("GridFS not initialized");

  const stream = bucket.openDownloadStreamByName(req.params.filename);
  stream.on("error", () => res.status(404).send("File not found"));
  res.setHeader("Cache-Control", "public, max-age=31536000");
  stream.pipe(res);
});

// ---------- 6. Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // Clerk authentication errors
  if (err.message?.includes("Unauthorized")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// ---------- 7. Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
>>>>>>> main
