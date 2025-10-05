import axios from "axios";
import { useEffect } from "react";
import { COURSE_API_END_POINT } from "../utils/apiEndPoints";
import { useDispatch } from "react-redux";
import { setCourse, setLoading } from "../redux/slice/coursesSlice";

export const useGetAllCourses = () => {
    const dispatch = useDispatch();

    const fetchCourses = async () => {
        try {
            dispatch(setLoading(true));
            const res = await axios.get(`${COURSE_API_END_POINT}`, {
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setCourse(res.data.courses));
            }
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return { refetch: fetchCourses };
};
