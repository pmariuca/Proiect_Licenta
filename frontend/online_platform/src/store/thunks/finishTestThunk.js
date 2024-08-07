import { createAsyncThunk } from '@reduxjs/toolkit';
import {submitAnswers} from "../../utils/apiCalls";

export const finishTest = createAsyncThunk(
    'test/finishTest',
    async ({ username, activityID, answers, fraudAttempts }, { dispatch, navigate }) => {
        await submitAnswers(username, activityID, answers, fraudAttempts);
    }
);