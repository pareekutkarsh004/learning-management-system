import { createClerkClient } from "@clerk/backend";
import User from "../models/User.js"; // Adjust path as needed

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// General authentication middleware (similar to your protectEducator)
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No auth header provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the session with Clerk
    const session = await clerk.sessions.verifySession(token);
    const userId = session.userId;
    const user = await clerk.users.getUser(userId);

    // Attach user info to request
    req.userId = userId;
    req.clerkUser = user;

    next();
  } catch (error) {
    console.error("Error in authenticateUser:", error);
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

// Your existing protectEducator middleware (unchanged)
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

// User controller - Get user data (with auto-creation if not exists)
export const getUserData = async (req, res) => {
  try {
    const clerkUserId = req.userId; // Set by authenticateUser middleware
    const clerkUser = req.clerkUser; // Clerk user object

    console.log("🔍 Getting user data for Clerk ID:", clerkUserId);

    // Find user in database by clerkId
    let user = await User.findOne({ clerkId: clerkUserId }).populate(
      "enrolledCourses"
    );

    if (!user) {
      console.log("👤 User not found in database, creating new user...");

      // Extract user info from Clerk user object
      const userName =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "Unknown User";
      const userEmail =
        clerkUser.emailAddresses?.[0]?.emailAddress || "no-email@example.com";
      const userImageUrl =
        clerkUser.imageUrl ||
        clerkUser.profileImageUrl ||
        "https://default-avatar.com/default.png";

      // Create new user if not found
      user = new User({
        clerkId: clerkUserId,
        name: userName,
        email: userEmail,
        imageUrl: userImageUrl,
        enrolledCourses: [],
      });

      await user.save();
      console.log("✅ New user created:", user._id);
    } else {
      console.log("✅ User found in database:", user._id);
    }

    // Return user data in the format your frontend expects
    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      user: {
        _id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error in getUserData:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's enrolled courses
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const clerkUserId = req.userId;

    console.log("🔍 Getting enrolled courses for Clerk ID:", clerkUserId);

    // Find user and populate enrolled courses
    const user = await User.findOne({ clerkId: clerkUserId }).populate({
      path: "enrolledCourses",
      select:
        "title description imageUrl price instructor courseContent createdAt",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      enrolledCourses: user.enrolledCourses || [],
    });
  } catch (error) {
    console.error("❌ Error in getUserEnrolledCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
