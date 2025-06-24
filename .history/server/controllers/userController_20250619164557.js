import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protectEducator = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No auth header" });
    }

    const token = authHeader.split(" ")[1];

    // Verify session using Clerk SDK
    const session = await clerk.sessions.verifySession(token);
    const userId = session.userId;

    // Get user data
    const user = await clerk.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: Not an educator" });
    }

    // Attach user info to request if needed downstream
    req.userId = userId;
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ success: false, message: "Invalid token or unauthorized" });
  }
};
