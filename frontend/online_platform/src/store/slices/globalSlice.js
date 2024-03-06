import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    checkTokenLoading: true,
    token: null,
    name: null,
    surname: null
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSurname: (state, action) => {
            state.surname = action.payload;
        }
    }
});
export const { setLoggedIn, setCheckTokenLoading, setToken, setName, setSurname } = globalSlice.actions;

export default globalSlice.reducer;