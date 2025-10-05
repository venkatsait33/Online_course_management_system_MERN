import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { COURSE_API_END_POINT } from '../../utils/apiEndPoints';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const CourseDetailPage = () => {
    const { id } = useParams(); // course ID from URL
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const fetchCourse = async () => {
        try {
            const data = await axios.get(`${COURSE_API_END_POINT}/course/${id}`);
            setCourse(data.data.course);
            toast.success(data.data.message)
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error)
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const isEnrolled = user && course?.enrolledStudents?.includes(user._id);

    const handleEnroll = async () => {
        try {
            const { data } = await axios.post(`${COURSE_API_END_POINT}/${id}/enroll`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setCourse(data.course);
            toast(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <div className=' flex justify-between items-center p-4 rounded-xl shadow-xl bg-slate-500 h-24'>
                <h1 className="text-2xl font-bold">{course?.title}</h1>
                {user ? (
                    <button
                        onClick={handleEnroll}
                        disabled={isEnrolled}
                        className={`btn ${isEnrolled ? 'btn-success' : 'btn-primary'}`}
                    >
                        {isEnrolled ? "Enrolled" : "Enroll"}
                    </button>
                ) : (
                    <p className="text-white">Login to enroll</p>
                )}


            </div>
            <div className='flex flex-col gap-3 p-3 bg-gray-800 mt-4 rounded-md shadow-2xl'>
                <p className="mb-2">{course?.description}</p>
                <p className="mb-2">Level: {course?.level}</p>
                <p className="mb-2">Duration: {course?.duration}</p>
                <p className="mb-2">Price: ${course?.price}</p>
                <p className="mb-2">Students Enrolled: {course?.students}</p>
            </div>
            <div>
                {
                    course?.instructorId?.fullname &&
                    <div className='flex gap-4 mt-4 bg-gray-600 rounded-xl shadow-xl p-4 items-center'>
                        <p>Instructor: <span className='text-xl font-semibold'>{course?.instructorId?.fullname}</span></p>
                        <Link to={`/InstructorProfile/${course?.instructorId?._id}`} className='btn btn-primary'>view</Link>
                    </div>
                }
            </div>

        </div>
    );
}

export default CourseDetailPage