/* eslint-disable camelcase */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    authModes: ''
};

const authModeSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setAuthModes(state, action) {
            state.authModes = action.payload;
        }
    }
});

export const { setAuthModes } = authModeSlice.actions;

export default authModeSlice.reducer;
