import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyforhrpayrollapp";

export const authMiddleware = (req, res, next) => {
  // Allow CORS preflight requests to pass through
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
