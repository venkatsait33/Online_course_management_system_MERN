import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { COURSE_API_END_POINT } from "../../utils/apiEndPoints";
import { Link } from "react-router-dom";
import { useGetInstructorCourses } from "../../hooks/useGetInstructorCourses";
import { setRefresh } from "../../redux/slice/instructorCourseSlice";
import { useState } from "react";
import { useEffect } from "react";

const InstructorDashboard = () => {
    const dispatch = useDispatch();
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalUnpublished: 0,
        totalStudents: 0,
        totalEarnings: 0,
    });

    const { courses, refresh, loading } = useSelector((state) => state.instructor);
    const { fetchInstructorCourses } = useGetInstructorCourses();

    const handlePublishToggle = async (id) => {
        try {
            const { data } = await axios.put(`${COURSE_API_END_POINT}/${id}/publish`, {}, {
                withCredentials: true,
            });
            toast.success(data.message);
            dispatch(setRefresh(!refresh));
            fetchStats()// trigger refetch
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to publish course");
        }
    };


    const fetchStats = async () => {
        try {
            const res = await axios.get(`${COURSE_API_END_POINT}/instructor/stats`, {
                withCredentials: true,
            });
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`${COURSE_API_END_POINT}/delete/${id}`, {
                withCredentials: true,
            });
            toast.success(data.message);
            dispatch(setRefresh(!refresh)); // Trigger re-fetch after delete
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete course");
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refresh])

    if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-3">Instructor Dashboard</h1>
            <p className=" divider "></p>
            <div className="p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Instructor Name</h1>
                    <Link to='/create-course' className="btn btn-primary">Create Course</Link>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 justify-between gap-4 items-center">
                    <div className="btn btn-accent btn-dash flex justify-between w-full max-w-xs">
                        <p>No. of Courses Published:</p>
                        <p>{stats?.totalCourses || 0}</p>
                    </div>
                    <div className="btn btn-secondary btn-dash flex justify-between w-full max-w-xs">
                        <p>Students Enrolled:</p>
                        <p>{stats?.totalStudents || 0}</p>
                    </div>
                    <div className="btn btn-info btn-dash flex justify-between w-full max-w-xs">
                        <p>totalEarnings :</p>
                        <p>{stats?.totalEarnings || 0}</p>
                    </div>
                    <div className="btn btn-info btn-dash flex justify-between w-full max-w-xs">
                        <p>Unpublished Courses:</p>
                        <p>{stats?.totalUnpublished || 0}</p>
                    </div>
                </div>
            </div>
            {courses.length === 0 ? (
                <p>No courses found. Start by creating a new one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {courses.map((course) => (
                        <div key={course._id} className="bg-base-100  p-4 rounded-xl shadow-xl hover:scale-105 transform transition-all">
                            <div>
                                <Link to={`/instructor/course/${course._id}`} className="text-lg font-semibold ">{course?.title}</Link>
                                <p className="text-sm ">{course?.description}</p>
                                <p className="mt-2 ">
                                    Status:{" "}
                                    <span
                                        className={`font-medium ${course.isPublished ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {course.isPublished ? "Published" : "Unpublished"}
                                    </span>
                                </p>
                                <div className="flex justify-between mt-2">
                                    <button className=" btn btn-error mt-4 ml-2" onClick={() => handleDelete(course._id)}>
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handlePublishToggle(course._id)}
                                        className={`mt-4 px-4 py-2 rounded-xl text-white ${course.isPublished ? "bg-red-500" : "bg-green-500"
                                            } hover:opacity-90`}
                                    >
                                        {course.isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
