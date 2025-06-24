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
