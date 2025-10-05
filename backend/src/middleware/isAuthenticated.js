import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from headers
        // const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

        let token;

        // ✅ 1. Check cookie token (for normal login)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // ✅ 2. Fallback: Check Authorization header (for Firebase login)
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in DB
        const user = await User.findById(decoded.userId).select("fullname role");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        // Attach user info to req for controllers
        req.user = {
            _id: user._id,
            fullname: user.fullname,
            role: user.role
        };

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message
        });
    }
};
