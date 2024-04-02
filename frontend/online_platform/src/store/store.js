import { configureStore } from '@reduxjs/toolkit';
import { globalSlice } from "./slices/globalSlice";
import {testSlice} from "./slices/testSlice";
import {courseSlice} from "./slices/courseSlice";

export default configureStore({
    reducer: {
        global: globalSlice.reducer,
        test: testSlice.reducer,
        course: courseSlice.reducer
    },
});