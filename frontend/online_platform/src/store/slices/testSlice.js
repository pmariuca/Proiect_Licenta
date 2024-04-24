import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activity: null,
    questions: null,
    currentQuestion: null,
    answers: [],
    isTestActive: false
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
            if (state.answers && state.currentQuestion != null) {
                console.log(state.answers, state.currentQuestion);
                state.answers[state.currentQuestion] = action.payload;
            }
        },
        setTestActive: (state, action) => {
            state.isTestActive = action.payload;
        }
    }
});