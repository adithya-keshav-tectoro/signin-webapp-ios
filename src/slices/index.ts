import { combineReducers } from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import LoginReducer from './auth/login/reducer';
import AuthModesReducer from './auth/authmodes/reducer';

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    AuthModes: AuthModesReducer
});

export default rootReducer;
