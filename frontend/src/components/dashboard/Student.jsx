import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { COURSE_API_END_POINT } from "../../utils/apiEndPoints";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const student = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useSelector(store => store.auth)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`${COURSE_API_END_POINT}/enrolled/my-courses`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCourses(res.data.enrolledCourses);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load courses");
      }
    };
    fetchEnrolledCourses();
  }, []);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center max-sm:flex-col shadow-2xl p-4 rounded-lg ">
        <h1 className="text-base "> Name: <span className="text-2xl font-bold mb-4">{user?.name}</span></h1>
        <p className="text-base ">Email: <span className="text-lg font-semibold mb-4">{user?.email}</span></p>
        <p className="text-base ">Phone: <span className="text-lg font-semibold mb-4">{user?.phoneNumber}</span></p>

      </div>
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
        {courses.length === 0 ? (
          <p>No courses enrolled yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="p-4 border rounded-xl shadow-md">
                <Link to={`/course/${course._id}`}>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default student