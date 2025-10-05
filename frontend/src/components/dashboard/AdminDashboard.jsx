import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ADMIN_API_END_POINT } from "../../utils/apiEndPoints";

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch all courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${ADMIN_API_END_POINT}/courses`, {
                withCredentials: true,
            });
            if (data.success) setCourses(data.courses);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    // Fetch enrollment report
    const fetchReport = async () => {
        try {
            const { data } = await axios.get(`${ADMIN_API_END_POINT}/reports/enrollments`, {
                withCredentials: true,
            });
            if (data.success) setReport(data.report);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load report");
        }
    };

    // Approve / Reject Course
    const handleStatusChange = async (id, status) => {
        try {
            const { data } = await axios.put(
                `${ADMIN_API_END_POINT}/course/${id}/status`,
                { isPublished: status },
                { withCredentials: true }
            );
            toast.success(data.message);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchReport();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;


    return (
        <div className="min-h-screen p-6 ">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className=" shadow p-4 rounded-xl text-center">
                    <p className="">Total Courses</p>
                    <p className="text-2xl font-semibold">{report.totalCourses || 0}</p>
                </div>
                <div className=" shadow p-4 rounded-xl text-center">
                    <p className="">Total Instructors</p>
                    <p className="text-2xl font-semibold">{report.totalInstructors || 0}</p>
                </div>
                <div className=" shadow p-4 rounded-xl text-center">
                    <p className="">Total Students Enrolled</p>
                    <p className="text-2xl font-semibold">{report.totalStudents || 0}</p>
                </div>
            </div>

            {/* Course Management */}
            <div className=" shadow rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>

                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className=" text-left">
                            <th className="p-2">Title</th>
                            <th className="p-2">Instructor</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Students</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course._id} className="border-b">
                                    <td className="p-2">{course.title}</td>
                                    <td className="p-2">{course.instructor.fullname}</td>

                                    <td className="p-2">₹{course.price}</td>
                                    <td className="p-2">{course.totalEnrolled}</td>
                                    <td className="p-2">
                                        {course.isPublished ? (
                                            <span className="text-green-600 font-medium">Published</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Unpublished</span>
                                        )}
                                    </td>
                                    <td className="p-2 text-center">
                                        {course.isPublished ? (
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleStatusChange(course._id, false)}
                                            >
                                                Reject
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleStatusChange(course._id, true)}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No courses found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
