import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    // Check if Clerk auth info is present
    if (!req.auth || !req.auth.userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: No authentication found",
        });
    }

    const userId = req.auth.userId;

    // Fetch user data from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Defensive check in case publicMetadata is missing
    const role = user?.publicMetadata?.role;

    if (role !== "educator") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied: Educator role required",
        });
    }

    // Pass control to the next middleware
    next();
  } catch (error) {
    console.error("Error in protectEducator middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
