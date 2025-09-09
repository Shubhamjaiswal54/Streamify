import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });
    }
    console.log("COMPLETE ALL THE THINGS");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "unauthorized -user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in auth middleware", error);
  }
};
