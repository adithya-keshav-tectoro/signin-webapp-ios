/* eslint-disable camelcase */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    user: null,
    error: '', // for error message
    loading: false,
    isUserLogout: false,
    errorMsg: false, // for error,
    baseUrl: 'https://portal.mdmdev.tectoro.com'
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        apiError(state, action) {
            state.error = action.payload.data;
            state.loading = true;
            state.isUserLogout = false;
            state.errorMsg = true;
        },
        loginSuccess(state, action) {
            state.user = action.payload;
            state.loading = false;
            state.errorMsg = false;
        },
        baseUrlSuccess(state, action) {
            state.baseUrl = action.payload;
        },
        logoutUserSuccess(state, action) {
            state.isUserLogout = true;
            state.user = null;
        },
        resetLoginFlags(state) {
            state.error = '';
            state.loading = false;
            state.errorMsg = false;
        }
    }
});

export const { apiError, loginSuccess, baseUrlSuccess, logoutUserSuccess, resetLoginFlags } = loginSlice.actions;

export default loginSlice.reducer;
