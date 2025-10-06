import  { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { COURSE_API_END_POINT } from "../utils/apiEndPoints";
import { Link, useParams } from "react-router-dom";

const InstructorProfile = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instructor, setInstructor] = useState(null);
    const { id } = useParams()
    const fetchInstructorCourses = async () => {
        try {
            const { data } = await axios.get(`${COURSE_API_END_POINT}/${id}/instructor/courses`, {
                withCredentials: true,
            });
            setCourses(data.courses);
            setInstructor(data.instructor);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load courses");
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInstructorCourses();
    }, []);

    if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

    return (
        <div className="p-6">
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-xl mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{instructor?.fullname}</h1>
                    <p className="text-sm">{instructor?.email}</p>
                    <p className="text-sm">Role: Instructor</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Courses published</h2>
            {courses.length === 0 ? (
                <p>No courses created yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-gray-800 text-white p-4 rounded-xl shadow-xl hover:scale-105 transform transition-all"
                        >
                            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                            <p className="text-sm mb-1">Students Enrolled: {course.studentsEnrolled}</p>
                            <p className="text-sm mb-1">Price: ₹{course.price}</p>

                            <Link to={`/course/${course._id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                                View Course
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorProfile;
