import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please login as Admin.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mishra_ji_secret");
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or removed.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token. Please login again.",
    });
  }
};

