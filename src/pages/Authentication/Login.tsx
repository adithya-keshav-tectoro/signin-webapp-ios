/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable multiline-comment-style */
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import logoDark from '../../assets/images/commons/logo-dark.svg';
import { APIClient } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';
import AuthSlider from './authCarousel';
import { convertTextCase, GetAuthModes, getBaseUrl } from 'Components/Common/Util';
import google from '../../assets/images/authModes/google.png';
import ldap from '../../assets/images/authModes/ldap.png';
import microsoft from '../../assets/images/authModes/microsoft.png';
import CommonModal from 'Components/Common/CommonModal';
import { useDispatch } from 'react-redux';
import { loginUser } from 'slices/thunks';

const Login = (props: any) => {
    const api = new APIClient();
    const dispatch: any = useDispatch();
    const navigate = useNavigate();
    const baseUrl = getBaseUrl();

    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const accountId = localStorage.getItem('account');
    const authModeString = GetAuthModes();
    const authModes = authModeString ? authModeString : [];
    const images: any = { microsoft: microsoft, google: google, ldap: ldap };
    const [selectedAuth, setSelectedAuth] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [showAuthPassword, setShowAuthPassword] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        if (code && state) {
            onStateAndCode(state, code);
        }
        if (!accountId) props.router.navigate('/account');
    }, []);

    const onStateAndCode = (state: any, code: any) => {
        setLoading(true);
        const params = { state: state, code: code, callback: window.location.origin };
        api.create(baseUrl + url.AUTH_OIDC_CALLBACK, params)
            .then((resp: any) => {
                if (resp.status.toLowerCase() === 'success') {
                    dispatch(loginUser(resp.data, navigate));
                }
            })
            .finally(() => setLoading(false));
    };

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Please Enter Your Username'),
            password: Yup.string().required('Please Enter Your Password')
        }),
        onSubmit: (values) => {
            setLoading(true);
            const params = { tenant: accountId, username: values.username, password: values.password, app: 'enroll', device: '' };
            api.create(baseUrl + url.LOGIN, params)
                .then((resp: any) => {
                    if (resp.status.toLowerCase() === 'success') {
                        localStorage.setItem('authObj', JSON.stringify({ username: values.username, password: values.password }));
                        toast.success(resp.data ? resp.data : 'OTP sent to your registered email address');
                        props.router.navigate('/login-otp-verify');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    });

    const handleAuthMode = (mode: any) => {
        if (mode.mode === 'ldap') {
            setShowModal(true);
            setSelectedAuth(mode);
        } else {
            setLoading(true);
            const params = { tenant: accountId, mode: mode.mode, app: 'enroll', callback: window.location.origin };
            api.get(baseUrl + url.AUTH_LOGIN, params)
                .then((resp: any) => {
                    if (resp.status.toLowerCase() === 'success') {
                        window.location.href = resp.data;
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    const authValidation: any = useFormik({
        enableReinitialize: true,
        initialValues: { authusername: '', authpassword: '' },
        validationSchema: Yup.object({
            authusername: Yup.string().required('Please Enter Your User Name'),
            authpassword: Yup.string().required('Please Enter Your Password')
        }),
        onSubmit: (values) => {
            console.log(values);
        }
    });

    const onCloseClick = () => {
        setShowModal(false);
        authValidation.setErrors({});
        authValidation.setTouched({});
        authValidation.setValues({ authusername: '', authpassword: '' });
    };

    const toggleAuthPassword = () => {
        setShowAuthPassword(!showAuthPassword);
    };

    const onAuthSignIn = () => {
        setAuthLoading(true);
        const params = {
            tenant: accountId,
            username: authValidation.values.authusername,
            password: authValidation.values.authpassword,
            app: 'enroll'
        };
        api.create(baseUrl + url.AUTH_LDAP, params)
            .then((resp: any) => {
                if (resp.status.toLowerCase() === 'success') {
                    dispatch(loginUser({}, navigate));
                }
            })
            .finally(() => setAuthLoading(false));
    };

    const handleModalBody = () => {
        return (
            <>
                <i className="position-absolute end-10 top-5 fs-20 ri-close-line cursor-pointer" onClick={onCloseClick}></i>
                <div className="px-3 py-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="height-45 width-45">
                            <img src={images[selectedAuth.mode]} alt={selectedAuth.mode} className="w-100 h-100" />
                        </div>
                        <h3 className="ps-2 mb-0">
                            {selectedAuth.mode === 'ldap' ? selectedAuth.mode?.toUpperCase() : convertTextCase(selectedAuth.mode)}
                        </h3>
                    </div>
                    <div>
                        <Label className="form-label">User Name</Label>
                        <Input
                            name="authusername"
                            placeholder="Enter User Name"
                            type="text"
                            onChange={authValidation.handleChange}
                            onBlur={authValidation.handleBlur}
                            value={authValidation.values.authusername || ''}
                            invalid={authValidation.touched.authusername && authValidation.errors.authusername ? true : false}
                        />
                        {authValidation.touched.authusername && authValidation.errors.authusername ? (
                            <FormFeedback type="invalid">{authValidation.errors.authusername}</FormFeedback>
                        ) : null}
                    </div>
                    <div className="pt-3">
                        <Label className="form-label">Password</Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                                name="authpassword"
                                id="password-input"
                                value={authValidation.values.authpassword || ''}
                                type={showAuthPassword ? 'text' : 'password'}
                                className={'form-control pe-5'}
                                placeholder="Enter your password"
                                autoComplete="new-password"
                                onChange={authValidation.handleChange}
                                onBlur={authValidation.handleBlur}
                                invalid={authValidation.touched.authpassword && authValidation.errors.authpassword ? true : false}
                            />
                            {authValidation.touched.authpassword && authValidation.errors.authpassword && (
                                <FormFeedback type="invalid">{authValidation.errors.authpassword}</FormFeedback>
                            )}
                            {authValidation.values.authpassword && authValidation.values.authpassword !== '' && (
                                <button
                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none cursor-auto text-muted"
                                    type="button"
                                    id="password-addon"
                                    onClick={toggleAuthPassword}
                                >
                                    <i
                                        id="password-icon"
                                        className={`${showAuthPassword ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle cursor-pointer`}
                                    ></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="pt-3">
                        <button
                            className={'btn btn-success btn-load w-100'}
                            disabled={authValidation.values.authusername === '' || authValidation.values.authpassword === '' || authLoading}
                            onClick={() => onAuthSignIn()}
                        >
                            <span className="d-flex align-items-center justify-content-center">
                                Sign In
                                {authLoading && (
                                    <span className="ms-2 spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </span>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    document.title = 'SignIn';

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center align-items-center overflow-y-auto">
                <Col lg={12}>
                    <Card className="overflow-x-hidden m-0">
                        <Row className="g-0 vh-100 vw-100">
                            <AuthSlider />

                            <Col lg={4} className="d-flex justify-content-center align-items-center">
                                <div className="w-100 p-4">
                                    <div className="p-lg-4 p-4">
                                        <div className="text-center mb-3 text-white-50">
                                            <div className="mb-4">
                                                <div className="d-inline-block auth-logo">
                                                    <img src={logoDark} alt="" height={40} />
                                                </div>
                                            </div>

                                            <h4 className={'mt-3 text-dark'}>{'Enterprise Mobility Solution'}</h4>
                                            <h5 className="fw-medium text-muted">{'Tectoro Consulting Pvt. Ltd'}</h5>
                                        </div>
                                        <div className="mt-3">
                                            <Form
                                                onSubmit={(e: any) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#"
                                            >
                                                <div className="d-flex align-items-center justify-content-center mb-1">
                                                    <p className={'fs-18 fw-medium text-primary'}>Login Account</p>
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Account ID</Label>
                                                    <Input
                                                        name="accountID"
                                                        className={'form-control fw-semibold '}
                                                        placeholder="Enter Account ID"
                                                        type="text"
                                                        value={accountId || ''}
                                                        disabled={true}
                                                    />
                                                </div>
                                                {authModes.some((auth: any) => auth.mode === 'local') && (
                                                    <>
                                                        <div className="mb-3">
                                                            <Label htmlFor="username" className="form-label">
                                                                User Name
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="username"
                                                                placeholder="Enter User Name"
                                                                name="username"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.username || ''}
                                                                invalid={
                                                                    validation.touched.username && validation.errors.username ? true : false
                                                                }
                                                            />
                                                            {validation.touched.username && validation.errors.username ? (
                                                                <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label className="form-label" htmlFor="password-input">
                                                                Password
                                                            </Label>
                                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                                <Input
                                                                    type={passwordShow ? 'text' : 'password'}
                                                                    className="form-control pe-5 password-input"
                                                                    placeholder="Enter password"
                                                                    id="password-input"
                                                                    name="password"
                                                                    value={validation.values.password || ''}
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    invalid={
                                                                        validation.touched.password && validation.errors.password
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                {validation.touched.password && validation.errors.password ? (
                                                                    <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                                ) : null}
                                                                <button
                                                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                                    type="button"
                                                                    id="password-addon"
                                                                    onClick={() => setPasswordShow(!passwordShow)}
                                                                >
                                                                    <i className="ri-eye-fill align-middle"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            <Button
                                                                color="success"
                                                                className="w-100"
                                                                type="submit"
                                                                disabled={
                                                                    validation.values?.username === '' ||
                                                                    validation.values?.password === '' ||
                                                                    loading
                                                                }
                                                            >
                                                                <span className="d-flex align-items-center justify-content-center">
                                                                    Sign In
                                                                    {loading && (
                                                                        <span className="ms-2 spinner-border" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <div
                                                            className="cursor-pointer text-primary"
                                                            onClick={() => props.router.navigate('/account')}
                                                        >
                                                            Back to Account ID
                                                        </div>
                                                        {authModes.some((auth: any) => auth.mode === 'local') && (
                                                            <Link to="/forgot-password" className="text-primary">
                                                                Forgot password?
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                                {authModes?.length > 1 && (
                                                    <div className="w-100 mt-3">
                                                        <div className="text-center mb-3">Sign in with</div>
                                                        <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
                                                            {authModes?.map(
                                                                (mode: any, ind: any) =>
                                                                    mode.mode !== 'local' && (
                                                                        <div
                                                                            className="d-flex align-items-center justify-content-center border br-3 py-2 padding-x-12 cursor-pointer"
                                                                            onClick={() => handleAuthMode(mode)}
                                                                            key={ind}
                                                                        >
                                                                            <div className="height-20 width-20 br-5">
                                                                                <img
                                                                                    src={images[mode.mode]}
                                                                                    alt={mode.mode}
                                                                                    className="w-100 h-100"
                                                                                />
                                                                            </div>
                                                                            <span className="fs-12 ps-2 align-self-end">
                                                                                {mode.mode === 'ldap'
                                                                                    ? mode.mode?.toUpperCase()
                                                                                    : convertTextCase(mode.mode)}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <CommonModal
                                                    show={showModal}
                                                    onCloseClick={onCloseClick}
                                                    handleModalBody={handleModalBody}
                                                    hideFooter={true}
                                                    hideHeader={true}
                                                />
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);
