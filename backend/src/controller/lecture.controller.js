import { Course } from "../model/course.model.js";

export const addLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, videoUrl, description } = req.body;
        const instructorId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Allow only the instructor who created the course
        if (course.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: "Not authorized to add lecture" });
        }

        course.lectures.push({ title, videoUrl, description });
        await course.save();

        res.status(201).json({
            success: true,
            message: "Lecture added successfully",
            lectures: course.lectures,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const instructorId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete lecture" });
        }

        course.lectures = course.lectures.filter(
            (lecture) => lecture._id.toString() !== lectureId
        );
        await course.save();

        res.status(200).json({
            success: true,
            message: "Lecture deleted successfully",
            lectures: course.lectures,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markLectureViewed = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Student must be enrolled
        if (!course.enrolledStudents.includes(studentId)) {
            return res.status(403).json({ message: "Not enrolled in this course" });
        }

        let progress = course.progressTracking.find(
            (p) => p.studentId.toString() === studentId.toString()
        );

        if (!progress) {
            progress = { studentId, viewedLectures: [lectureId] };
            course.progressTracking.push(progress);
        } else if (!progress.viewedLectures.includes(lectureId)) {
            progress.viewedLectures.push(lectureId);
        }

        await course.save();

        const totalLectures = course.lectures.length;
        const viewedCount = progress.viewedLectures.length;
        const progressPercent = ((viewedCount / totalLectures) * 100).toFixed(1);

        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            progressPercent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getCourseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(courseId)
            .populate("instructorId", "name")
            .lean();

        if (!course) return res.status(404).json({ message: "Course not found" });

        const isInstructor = course.instructorId._id.toString() === userId.toString();
        const isEnrolled = course.students.some(
            (id) => id.toString() === userId.toString()
        );

        // Get user's progress
        const progressData = course.progressTracking.find(
            (p) => p.studentId.toString() === userId.toString()
        );

        const viewedLectures = progressData?.viewedLectures || [];
        const totalLectures = course.lectures.length;
        const viewedCount = viewedLectures.length;
        const progressPercent = totalLectures
            ? ((viewedCount / totalLectures) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            course: {
                ...course,
                isInstructor,
                isEnrolled,
                progressPercent,
                viewedLectures,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.user._id; // from auth middleware

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
    

        const lecture = course.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        // Check if user is enrolled or instructor
        const isInstructor = course.instructorId.toString() === userId.toString();
        const isEnrolled = course.enrolledStudents.some(
            (student) => student.toString() === userId.toString()
        );

        if (!isInstructor && !isEnrolled) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        // Mark as viewed (only if student)
        if (isEnrolled) {
            const progress = course.progressTracking.find(
                (p) => p.studentId.toString() === userId.toString()
            );

            if (progress) {
                if (!progress.viewedLectures.includes(lectureId)) {
                    progress.viewedLectures.push(lectureId);
                }
            } else {
                course.progressTracking.push({
                    studentId: userId,
                    viewedLectures: [lectureId],
                });
            }

            await course.save();
        }

        res.status(200).json({
            success: true,
            lecture,
            courseId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
