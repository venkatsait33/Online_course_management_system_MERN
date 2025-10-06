import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COURSE_API_END_POINT, LECTURE_API_END_POINT } from '../../utils/apiEndPoints';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const CourseDetailPage = () => {
    const { id } = useParams(); // course ID from URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewedLectures, setViewedLectures] = useState([]);
    const { user } = useSelector((state) => state.auth);

    // ✅ Fetch course details
    const fetchCourse = async () => {
        try {
            const { data } = await axios.get(`${COURSE_API_END_POINT}/course/${id}`);
            setCourse(data.course);
            setViewedLectures(data.course.progress?.[user?._id] || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch course");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const isEnrolled = user && course?.enrolledStudents?.includes(user._id);
    const isInstructor = user && user._id === course?.instructorId?._id;

    // ✅ Enroll Function
    const handleEnroll = async () => {
        try {
            const { data } = await axios.post(
                `${COURSE_API_END_POINT}/${id}/enroll`,
                {},
                { withCredentials: true }
            );
            setCourse(data.course);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        }
    };

    // ✅ Mark lecture as viewed
    const handleMarkViewed = async (lectureId) => {
        try {
            const { data } = await axios.post(
                `${LECTURE_API_END_POINT}/${id}/lectures/${lectureId}/view`,
                {},
                { withCredentials: true }
            );
            setViewedLectures(data.viewedLectures);
        } catch (error) {
            toast.error("Failed to mark lecture as viewed");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!course) return <p>Course not found</p>;


    return (
        <div className="p-6 text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 rounded-xl shadow-xl bg-slate-500 h-24">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                {user ? (
                    isInstructor ? (
                        <Link
                            to={`/course/${course._id}/view`}
                            className="btn btn-accent"
                        >
                            Go to Instructor View
                        </Link>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={isEnrolled}
                            className={`btn ${isEnrolled ? "btn-success" : "btn-primary"}`}
                        >
                            {isEnrolled ? "Enrolled" : "Enroll"}
                        </button>
                    )
                ) : (
                    <p className="text-white">Login to enroll</p>
                )}
            </div>

            {/* Course Info */}
            <div className="flex flex-col gap-3 p-3 bg-gray-800 mt-4 rounded-md shadow-2xl">
                <p>{course.description}</p>
                <p>Level: {course.level}</p>
                <p>Duration: {course.duration}</p>
                <p>Price: ${course.price}</p>
                <p>Students Enrolled: {course.enrolledStudents?.length}</p>
            </div>

            {/* Instructor Info */}
            <div>
                {course?.instructorId?.fullname && (
                    <div className="flex gap-4 mt-4 bg-gray-600 rounded-xl shadow-xl p-4 items-center">
                        <p>
                            Instructor:{" "}
                            <span className="text-xl font-semibold">
                                {course.instructorId.fullname}
                            </span>
                        </p>
                        <Link
                            to={`/InstructorProfile/${course.instructorId._id}`}
                            className="btn btn-primary"
                        >
                            View
                        </Link>
                    </div>
                )}
            </div>

            {/* ✅ Lectures Section */}
            <div className="mt-6 bg-gray-700 text-white rounded-xl p-4 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Lectures</h3>
                {course.lectures?.length === 0 ? (
                    <p>No lectures added yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {course.lectures.map((lecture, index) => {
                            const viewed = viewedLectures.includes(lecture._id);
                            return (
                                <li
                                    key={lecture._id}
                                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                                >
                                    <span>
                                        {index + 1}. {lecture?.title}
                                    </span>

                                    <div className="flex gap-3 items-center">
                                        {/* Watch Lecture */}
                                        {isEnrolled ? (
                                            <Link
                                                to={`/${id}/lecture/${lecture._id}`}
                                                className="btn btn-sm btn-accent"
                                            >
                                                Watch
                                            </Link>
                                        ) : (
                                            <button className="btn btn-sm btn-disabled">
                                                Watch (Enroll first)
                                            </button>
                                        )}

                                        {/* Mark Viewed */}
                                        {isEnrolled && (
                                            <button
                                                onClick={() => handleMarkViewed(lecture._id)}
                                                className={`btn btn-sm ${viewed ? "btn-success" : "btn-outline"}`}
                                            >
                                                {viewed ? "Viewed" : "Mark as Viewed"}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ✅ Progress Tracker */}
            {isEnrolled && course.lectures?.length > 0 && (
                <div className="mt-6 bg-gray-600 p-4 rounded-lg text-white">
                    <h4 className="font-semibold text-lg mb-2">Progress</h4>
                    <p>
                        {viewedLectures.length}/{course.lectures.length} lectures viewed
                    </p>
                    <progress
                        className="progress progress-success w-full"
                        value={viewedLectures.length}
                        max={course.lectures.length}
                    ></progress>
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;
