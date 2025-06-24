<<<<<<< HEAD
import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No auth info" });
    }

    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
=======
// middleware/auth.js
import { clerk } from "../utils/clerkClient.js";
import { verifyToken } from "@clerk/backend";
import { requireAuth } from "@clerk/express";
import User from "../models/User.model.js"; // ✅ Add this import
import dotenv from "dotenv";
dotenv.config();

// ✅ Middleware to authenticate any Clerk user
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

    // ✅ Correct usage of verifyToken with secretKey
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    console.log("✅ Token verified, payload:", payload);

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

// ✅ Middleware to protect educator-only routes
export const protectEducator = [
  requireAuth(), // verifies JWT and attaches req.auth
  async (req, res, next) => {
    try {
      const { userId } = req.auth;

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found in database",
        });
      }

      if (user.role !== "educator") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not authorized as educator",
        });
      }

      // Attach user to request
      req.user = user;
      req.userId = userId;

      next();
    } catch (err) {
      console.error("❌ Error in protectEducator:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
];
>>>>>>> main
