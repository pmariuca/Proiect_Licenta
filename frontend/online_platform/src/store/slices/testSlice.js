import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activity: null,
    questions: null,
    currentQuestion: null,
    answers: []
};

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setActivity: (state, action) => {
            state.activity = action.payload;
        },
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
        setAnswer: (state, action) => {
            if (state.answers && state.currentQuestion != null) {
                state.answers[state.currentQuestion] = action.payload;
            }
        }
    }
});