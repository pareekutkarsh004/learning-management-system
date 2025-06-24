import { requireAuth } from "@clerk/express"; // v4

app.use("/api/user", express.json(), requireAuth(), userRouter);
