import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { COURSE_API_END_POINT } from '../../utils/apiEndPoints';
import AddLectureForm from './AddLectureForm';
import LectureList from './LectureList';

const InstructorCourseDetailPage = () => {
    const { id } = useParams(); // course ID from URL
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(true);
    const [lecture, setLecture] = useState([]);

    const fetchCourse = async () => {
        try {
            const data = await axios.get(`${COURSE_API_END_POINT}/course/${id}`);
            setCourse(data.data.course);
            setLecture(data.data.course.lectures);
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



    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 flex flex-col gap-3">
            <div className=' flex justify-between items-center p-4 rounded-xl shadow-xl bg-slate-500 h-24'>
                <h1 className="text-2xl font-bold">{course?.title}</h1>
            </div>
            <div className='flex flex-col gap-3 p-3 bg-gray-800 mt-4 rounded-md shadow-2xl'>
                <p className="mb-2">{course?.description}</p>
                <p className="mb-2">Level: {course?.level}</p>
                <p className="mb-2">Duration: {course?.duration}</p>
                <p className="mb-2">Price: ${course?.price}</p>
                <p className="mb-2">Students Enrolled: {course?.students}</p>
            </div>

            <AddLectureForm courseId={id} fetchCourse={fetchCourse} />
            <LectureList courseId={id} lectures={lecture} fetchCourse={fetchCourse} />

        </div>
    );
}

export default InstructorCourseDetailPage