import { configureStore } from '@reduxjs/toolkit';
import { globalSlice } from "./slices/globalSlice";
import {testSlice} from "./slices/testSlice";

export default configureStore({
    reducer: {
        global: globalSlice.reducer,
        test: testSlice.reducer
    },
});