import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { createCourse, deleteCourse, enrollCourse, getAllCourses, getCourseById, getEnrolledCourses, getInstructorCourses, getInstructorStats, togglePublishCourse } from "../controller/course.controller.js"

const router = express.Router()
router.post('/create-course', isAuthenticated, createCourse)
router.post('/:id/enroll', isAuthenticated, enrollCourse);
router.get('/', getAllCourses)
router.get('/course/:id', getCourseById)

router.get("/enrolled/my-courses", isAuthenticated, getEnrolledCourses);

router.get("/instructor/courses", isAuthenticated, getInstructorCourses);
router.put("/:id/publish", isAuthenticated, togglePublishCourse);

router.get('/instructor/stats', isAuthenticated, getInstructorStats)

router.delete("/delete/:id", isAuthenticated, deleteCourse);
export default router