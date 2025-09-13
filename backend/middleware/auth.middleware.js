import jwt from "jsonwebtoken";
import config from "../config.js";

export const authenticateUser = (req, res, next) => {
  const token =
    req.cookies.jwt ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res
      .status(401)
      .json({ error: "Invalid token, authorization denied." });
  }
};
