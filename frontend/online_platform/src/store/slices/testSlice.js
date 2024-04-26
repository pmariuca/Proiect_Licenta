import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activity: null,
    questions: null,
    currentQuestion: null,
    answers: [],
    copy: 0,
    paste: 0,
    cut: 0,
    exitWindow: 0,
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
                state.answers[state.currentQuestion] = action.payload;
            }
        },
        setCopy: (state, action) => {
            state.copy ++;
        },
        setPaste: (state, action) => {
            state.paste ++;
        },
        setCut: (state, action) => {
            state.cut ++;
        },
        setExitWindow: (state, action) => {
            state.exitWindow ++;
        },
        setTestActive: (state, action) => {
            state.isTestActive = action.payload;
        }
    }
});