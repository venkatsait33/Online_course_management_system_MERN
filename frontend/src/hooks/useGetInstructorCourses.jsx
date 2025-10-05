import { useDispatch, useSelector } from "react-redux";
import { setCourses, setLoading } from "../redux/slice/instructorCourseSlice";
import axios from "axios";
import { COURSE_API_END_POINT } from "../utils/apiEndPoints";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const useGetInstructorCourses = () => {
    const dispatch = useDispatch();
    const { refresh } = useSelector((state) => state.instructor);

    const fetchInstructorCourses = async () => {
        try {
            dispatch(setLoading(true));
            const { data } = await axios.get(`${COURSE_API_END_POINT}/instructor/courses`, {
                withCredentials: true,
            });
            if (data.success) {
                dispatch(setCourses(data.courses));
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to fetch courses");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchInstructorCourses();
    }, [refresh])

    return { fetchInstructorCourses };
}