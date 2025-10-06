import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { addLecture, deleteLecture, getCourseLectures, getLectureById, markLectureViewed } from '../controller/lecture.controller.js';


const router = express.Router();

router.get("/:courseId/lectures", isAuthenticated, getCourseLectures);
router.post("/:courseId/lectures", isAuthenticated, addLecture);
router.delete("/:courseId/lectures/:lectureId", isAuthenticated, deleteLecture);
router.put("/:courseId/lectures/:lectureId/view", isAuthenticated, markLectureViewed);
router.get("/:courseId/lecture/:lectureId", isAuthenticated, getLectureById);

export default router;