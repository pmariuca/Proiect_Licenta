import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    token: null,
    username: null,
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
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSurname: (state, action) => {
            state.surname = action.payload;
        }
    }
});
