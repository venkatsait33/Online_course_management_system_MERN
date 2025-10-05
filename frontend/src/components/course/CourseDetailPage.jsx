import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { COURSE_API_END_POINT } from '../../utils/apiEndPoints';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

const CourseDetailPage = () => {
    const { id } = useParams(); // course ID from URL
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await axios.get(`${COURSE_API_END_POINT}/course/${id}`);
                setCourse(data.data.course);
                setLoading(false);

            } catch (error) {
                console.error(error);
                setMessage("Error fetching course");
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        try {
            const { data } = await axios.post(`${COURSE_API_END_POINT}/${id}/enroll`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log(data);
            setCourse(data.course); // update course info with new student count
            setMessage(data.message);
            toast(data.message)
        } catch (error) {
            setMessage(error.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{course?.title}</h1>
            <p className="mb-2">{course?.description}</p>
            <p className="mb-2">Level: {course?.level}</p>
            <p className="mb-2">Duration: {course?.duration}</p>
            <p className="mb-2">Price: ${course?.price}</p>
            <p className="mb-2">Students Enrolled: {course?.students}</p>

            <button
                onClick={handleEnroll}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Enroll
            </button>

            {message && <p className="mt-2 text-green-600">{message}</p>}
        </div>
    );
}

export default CourseDetailPage