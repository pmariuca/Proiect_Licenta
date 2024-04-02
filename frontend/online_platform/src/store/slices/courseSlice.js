import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    courseID: null,
    courseData: null
};

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setCourseID: (state, action) => {
            state.courseID = action.payload;
        },
        setCourseData: (state, action) => {
            state.courseData = action.payload;
        }
    }
});