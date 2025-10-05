// models/Course.js
import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true
        },
        status: { type: String, default: "pending" },
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
        duration: { type: String, trim: true },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
        description: { type: String, trim: true, maxlength: 2000 },
        image: { type: String, trim: true },
        isPublished: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);

// Indexes for faster search by title/instructor
CourseSchema.index({ title: 'text', instructor: 'text' });

export const Course = mongoose.model("Course", CourseSchema);
