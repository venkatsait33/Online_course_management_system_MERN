import express from "express";
import {
    getInstructorsWithCourses,
    getAllCourses,
    updateCourseStatus,
    getEnrollmentReport,
    adminLogin,
    adminSignUp,
} from "../controller/admin.controller.js";
import { isAuthenticated, requireAdmin } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/admin-signup", adminSignUp);

router.get("/instructors", getInstructorsWithCourses);
router.get("/courses", getAllCourses);
router.put("/course/:id/status", updateCourseStatus);
router.get("/reports/enrollments", getEnrollmentReport);

export default router;
