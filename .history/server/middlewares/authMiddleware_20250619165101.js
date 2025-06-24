import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No auth header" });
    }

    const token = authHeader.split(" ")[1];
    const session = await clerk.sessions.verifySession(token);
    req.userId = session.userId;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
