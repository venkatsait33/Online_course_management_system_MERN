import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/slice/instructorCourseSlice";
import { COURSE_API_END_POINT } from "../../utils/apiEndPoints";

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.course);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      // convert price to Number
      [name]: name === 'price' ? Number(value) :
        name === 'level' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, duration, level, price, image } = courseData;
    if (!title || !description || !duration || !level || !price || !image) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log(courseData);

    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(`${COURSE_API_END_POINT}/create-course`, courseData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setCourseData({ title: "", description: "", duration: "", level: "", price: '', image: '' });
        navigate("/instructor/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className=" shadow-lg  rounded-2xl p-8 w-full max-w-md bg-gray-600" >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create New Course</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows="3"
              placeholder="Enter course description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (in hours)</label>
            <input
              type="text"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="e.g., 10 hours"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (in rupees)</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="100, 200, 300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image (past image link here)</label>
            <input
              type="text"
              name="image"
              value={courseData.image}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="image link"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {loading ? (
            <button type="button" className="btn btn-neutral w-full">
              <span className="loading loading-spinner"></span>
            </button>
          ) : (
            <button type="submit" className="btn btn-neutral w-full">
              Create Course
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
