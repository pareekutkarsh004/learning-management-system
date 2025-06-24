import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webHooks.js";
import educatorRouter from "./route/educatorRoutes.js";
import { createClerkExpressWithAuth } from "@clerk/express"; // ✅ NEW CORRECT ONE
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./route/courseRoute.js";
import userRouter from "./route/userRoutes.js";

const app = express();

await connectDB();
await connectCloudinary();

app.use(cors());
const clerkExpressWithAuth = createClerkExpressWithAuth(); // ✅ Instantiate
app.use(clerkExpressWithAuth); // ✅ Use the middleware

app.get("/", (req, res) => res.send("API working"));

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
