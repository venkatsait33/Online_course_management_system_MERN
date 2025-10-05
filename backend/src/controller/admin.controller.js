import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { Course } from "../model/course.model.js";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not an admin user",
            });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign(
            { _id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                success: true,
                message: "Admin logged in successfully",
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role,
                    name: admin.fullname,
                },
            });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const adminSignUp = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role: 'admin',
        });
        const tokenData = { userId: newUser._id, role: newUser.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201)
            .cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: "User created successfully",
                user: { ...newUser._doc, password: undefined },
                success: true
            });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}


// ✅ 1. Get all instructors and their posted courses
export const getInstructorsWithCourses = async (req, res) => {
    try {
        const instructors = await User.aggregate([
            { $match: { role: "instructorId" } },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "instructorId",
                    as: "courses",
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalCourses: { $size: "$courses" },
                    courses: {
                        _id: 1,
                        title: 1,
                        status: 1,
                        enrolledStudents: 1,
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            instructors,
        });
    } catch (error) {
        console.error("Error fetching instructors with courses:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ 2. Get all courses with number of enrolled students
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructorId", "fullname email")
            .select("title status enrolledStudents instructorId");

        const formattedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            instructor: course.instructorId,
            status: course.status,
            totalEnrolled: course.enrolledStudents?.length || 0,
        }));

        res.status(200).json({ success: true, courses: formattedCourses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// ✅ 3. Approve or reject course
export const updateCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // expected values: "approved" or "rejected"

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Course ${status} successfully`,
            course,
        });
    } catch (error) {
        console.error("Error updating course status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ✅ 4. Get Reports - number of students enrolled per course
export const getEnrollmentReport = async (req, res) => {
    try {
        const report = await Course.aggregate([
            {
                $project: {
                    title: 1,
                    totalEnrolled: { $size: "$enrolledStudents" },
                },
            },
            { $sort: { totalEnrolled: -1 } },
        ]);

        res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
