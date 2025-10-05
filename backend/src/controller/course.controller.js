import { Course } from "../model/course.model.js";
import { User } from "../model/user.model.js";

export const createCourse = async (req, res) => {
    try {
        const { title, description, duration, level, price, image } = req.body;

        // Ensure the logged-in user is an instructor
        if (!req.user || req.user.role !== "instructor") {
            return res.status(403).json({ message: "Only instructors can create courses", success: false });
        }

        // Validate required fields
        if (!title || !description || !duration || !level || !price || !image) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Ensure level matches enum exactly
        const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase(); // Beginner, Intermediate, Advanced

        // Ensure price is a number
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) {
            return res.status(400).json({ message: "Price must be a number", success: false });
        }

        const course = new Course({
            title,
            description,
            duration,
            level: formattedLevel,
            price: numericPrice,
            image,
            instructorId: req.user._id
        });

        await course.save();

        res.status(201).json({
            course,
            message: "Course created successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructorId", "fullname email")
        res.status(200).json({ courses, success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructorId", "fullname email");
        if (!course) {
            return res.status(404).json({ message: "Course not found", success: false });
        }
        res.status(200).json({ course, success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}

export const enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id; // course ID from URL
        const studentId = req.user._id; // logged-in student

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found", success: false });
        }

        // Check if student already enrolled
        if (course.enrolledStudents.includes(studentId)) {
            return res.status(400).json({ message: "Student already enrolled", success: false });
        }

        // Add student to enrolledStudents array and increment count
        course.enrolledStudents.push(studentId);
        course.studentsEnrolled += 1;
        course.students = course.enrolledStudents.length;

        await course.save();

        await User.findByIdAndUpdate(studentId, {
            $addToSet: { enrolledCourses: courseId }
        })

        res.status(200).json({ message: "Enrolled successfully", course, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            enrolledCourses: user.enrolledCourses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch enrolled courses" });
    }
};

export const getInstructorCourses = async (req, res) => {
    try {
        // ensure instructor is logged in
        const instructorId = req.user?._id;  // set by auth middleware
        if (!instructorId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - please login first"
            });
        }

        // verify that logged-in user is an instructor
        const instructor = await User.findById(instructorId);
        if (!instructor || instructor.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied - only instructors can view this"
            });
        }

        // find courses created by instructor
        const courses = await Course.find({ instructorId: instructorId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        res.status(500).json({
            success: false,
            message: "Server error - failed to fetch courses"
        });
    }
};

export const togglePublishCourse = async (req, res) => {
    try {
        const instructorId = req.user?._id;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        course.isPublished = !course.isPublished;
        await course.save();

        res.status(200).json({
            success: true,
            message: course.isPublished ? "Course published successfully" : "Course unpublished",
            course
        });
    } catch (error) {
        console.error("Error publishing course:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getInstructorStats = async (req, res) => {
    try {
        const instructorId = req.user._id;

        // Get all courses by this instructor
        const courses = await Course.find({ instructorId });

        const totalCourses = courses.length;
        const totalUnpublished = courses.filter(c => !c.isPublished).length;
        const totalStudents = courses.reduce(
            (acc, course) => acc + (course.enrolledStudents?.length || 0),
            0
        );

        // Earnings assuming price is per student
        const totalEarnings = courses.reduce(
            (acc, course) => acc + ((course.enrolledStudents?.length || 0) * course.price),
            0
        );

        res.status(200).json({
            success: true,
            totalCourses,
            totalUnpublished,
            totalEarnings,
            totalStudents,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params; // course ID from URL params

        // Find the course by ID
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this course",
            });
        }

        // Delete the course
        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getInstructorByCoursesId = async (req, res) => {
    try {
        const { instructorId } = req.params; // ✅ correct extraction

        // 1️⃣ Validate ID
        if (!instructorId) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required",
            });
        }

        // 2️⃣ Fetch instructor’s courses
        const courses = await Course.find({ instructorId })
            .populate("instructorId", "fullname email")
            .lean();

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this instructor",
            });
        }

        // 3️⃣ Calculate total earnings for each course
        const formattedCourses = courses.map((course) => ({
            ...course,
            studentsEnrolled: course.students?.length || 0,
            totalEarnings: (course.students?.length || 0) * (course.price || 0),
        }));

        // 4️⃣ Send response
        return res.status(200).json({
            success: true,
            instructor: courses[0]?.instructorId || {},
            courses: formattedCourses,
        });
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



