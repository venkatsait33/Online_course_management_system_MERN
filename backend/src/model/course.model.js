// models/Course.js
import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String },

});

const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        students: { type: Number, default: 0, min: 0 },
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        studentsEnrolled: {
            type: Number,
            default: 0,
        },

        price: { type: Number, required: true, min: 0 },
        revenue: { type: Number, default: 0 },
        duration: { type: String, trim: true },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
        description: { type: String, trim: true, maxlength: 2000 },
        image: { type: String, trim: true },
        isPublished: { type: Boolean, default: false },
        lectures: [lectureSchema],

        // Each student's progress (lecture IDs marked as viewed)
        progressTracking: [
            {
                studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                viewedLectures: [{ type: mongoose.Schema.Types.ObjectId }],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster search by title/instructor
CourseSchema.index({ title: 'text', instructor: 'text' });

export const Course = mongoose.model("Course", CourseSchema);
