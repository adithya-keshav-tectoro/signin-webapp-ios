import React from 'react';
import { Navigate } from 'react-router-dom';

// //login
import Login from '../pages/Authentication/Login';
import ForgetPassword from '../pages/Authentication/ForgetPassword';
import Logout from '../pages/Authentication/Logout';

// // User Profile
import Dashboard from 'pages/Dashboard/Dashboard';
import Error404 from 'Components/Common/Errors/Error404';
import Error401 from 'Components/Common/Errors/Error401';
import Error500 from 'Components/Common/Errors/Error500';
import Offlinepage from 'Components/Common/Errors/Offlinepage';
import Maintenance from 'Components/Common/Errors/Maintenance';
import SuccessMsg from 'pages/Authentication/SuccessMsg';
import TwosVerify from 'pages/Authentication/TwosVerify';
import Account from 'pages/Authentication/Account';

const authProtectedRoutes = [
    // this route should be at the end of all other routes
    // eslint-disable-next-line react/display-name
    { path: '/', exact: true, component: <Navigate to="/dashboard" /> },
    { path: '*', component: <Navigate to="/" /> },
    { path: '/dashboard', component: <Dashboard /> }
];

const publicRoutes = [
    // Authentication Page
    { path: '/account', component: <Account /> },
    { path: '/login', component: <Login /> },
    { path: '/logout', component: <Logout /> },
    { path: '/forgot-password', component: <ForgetPassword /> },
    { path: '/login-otp-verify', component: <TwosVerify /> },
    { path: '/forgot-otp-verify', component: <TwosVerify /> },
    { path: '/successmsg', component: <SuccessMsg /> },
    { path: '/auth-404', component: <Error404 /> },
    { path: '/auth-401', component: <Error401 /> },
    { path: '/auth-500', component: <Error500 /> },
    { path: '/auth-offline', component: <Offlinepage /> },
    { path: '/maintenance', component: <Maintenance /> }
];

export { authProtectedRoutes, publicRoutes };
