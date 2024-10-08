import { setAuthModes } from './reducer';

export const authModesAction = (authModes: any, history: any) => async (dispatch: any) => {
    dispatch(setAuthModes(authModes));
    history('/login');
};
