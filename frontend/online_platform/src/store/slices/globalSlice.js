import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    token: null,
    name: null,
    surname: null,
    remember: false,
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSurname: (state, action) => {
            state.surname = action.payload;
        },
        setRemember: (state, action) => {
            state.remember = action.payload;
        },
    }
});
