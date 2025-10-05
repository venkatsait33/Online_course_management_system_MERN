import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        let token;
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("fullname role");

        if (!user) {
            return res.status(401).json({ message: "User not found", success: false });
        }

        // attach user info
        req.user = {
            _id: user._id,
            fullname: user.fullname,
            role: user.role
        };

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

// Middleware for admin-only routes
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required", success: false });
    }
    next();
};
