import { createSlice } from "@reduxjs/toolkit";

const instructorCourseSlice = createSlice({
    name: "instructorCourses",
    initialState: {
        courses: [],
        loading: false,
        refresh: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
        setRefresh: (state, action) => {
            state.refresh = action.payload;
        }
    },
});

export const { setLoading, setCourses, setRefresh } = instructorCourseSlice.actions;
export default instructorCourseSlice.reducer;
