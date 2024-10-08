import { loginSuccess, logoutUserSuccess, apiError, resetLoginFlags, baseUrlSuccess } from './reducer';

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
    dispatch(loginSuccess(user));
    history('/dashboard');
};

export const setBaseUrl = (url: any) => async (dispatch: any) => {
    dispatch(baseUrlSuccess(url));
};

export const logoutUser = () => async (dispatch: any) => {
    try {
        sessionStorage.removeItem('authUser');
        dispatch(logoutUserSuccess(true));
    } catch (error) {
        dispatch(apiError(error));
    }
};

export const resetLoginFlag = () => async (dispatch: any) => {
    try {
        const response = dispatch(resetLoginFlags());
        return response;
    } catch (error) {
        dispatch(apiError(error));
    }
};
