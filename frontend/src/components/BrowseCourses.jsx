import { courseData } from '../utils/sampleData'
import BrowseCard from './BrowseCard'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllCourses } from '../hooks/useGetAllCourses';

const BrowseCourses = () => {
    const { loading, course } = useSelector((store) => store.course);
    useGetAllCourses();

    if (loading) return <p>Loading your courses...</p>;
    if (course?.length === 0) return <p>You have not enrolled in any courses yet.</p>;
    return (
        <div className=' max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4'>
            {
                course?.map((course) => {
                    return (
                        <div key={course._id} className='p-4 shadow-xl rounded-lg overflow-hidden border '>
                            <Link to={`/course/${course._id}`} className=" ">
                                <div className='flex justify-between items-center'> <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
                                    <Link to={`/course/${course._id}`} className='btn btn-accent  btn-sm'>
                                        View
                                    </Link></div>
                                <div className='grid grid-cols-2 gap-2 max-sm:grid-cols-1'>
                                    <p className="mb-2">Level: {course.level}</p>
                                    <p className="mb-2">Duration: {course.duration}</p>
                                    <p className="mb-2">Price: ${course.price}</p>
                                    <p className="mb-2">Students Enrolled: {course.students}</p>
                                </div>

                            </Link>
                        </div>
                    )
                })
            }
            {
                courseData.map(course => {
                    return (
                        <div className="card" key={course.id}>
                            <div className="">
                                <BrowseCard course={course} />

                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BrowseCourses