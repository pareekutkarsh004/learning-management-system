import { createClerkClient, verifyToken } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Now you have clerk.users, clerk.sessions, etc

export const protectEducator = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No auth header" });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token, process.env.CLERK_SECRET_KEY);
    const userId = payload.sub;

    const user = await clerk.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: Not an educator" });
    }

    // Attach user to request
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
