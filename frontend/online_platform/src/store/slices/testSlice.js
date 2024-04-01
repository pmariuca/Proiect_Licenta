import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activity: null,
    questions: null,
    currentQuestion: null,
    answers: null
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
        setAnswers: (state, action) => {
            state.answers = action.payload;
        }
    }
});