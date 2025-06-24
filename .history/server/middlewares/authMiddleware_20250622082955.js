// middleware/auth.js
import { clerk } from "../utils/clerkClient.js"; 
import { verifyToken } from "@clerk/backend";// ✅ already created and exported from clerkClient.js

// Middleware to authenticate any logged-in user
export const authenticateUser = async (req, res, next) => {
  try {
    console.log("🔍 Auth middleware - Headers:", req.headers);

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    console.log("🔍 Token received:", token.substring(0, 20) + "...");

    // Verify token with Clerk
    const payload = await verifyToken(token);
    console.log("✅ Token verified, payload:", payload);

    // Clerk stores user ID in 'sub'
    req.auth = {
      userId: payload.sub,
      ...payload,
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};

// Middleware to protect educator-only routes
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
    console.error("❌ Error in protectEducator:", error);
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
