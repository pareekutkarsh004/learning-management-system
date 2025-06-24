import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protectEducator = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No auth header provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const session = await clerk.sessions.verifySession(token);
    const userId = session.userId;
    const user = await clerk.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized as educator",
      });
    }

    req.userId = userId;
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectEducator:", error);
    if (error?.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
