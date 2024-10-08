/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable multiline-comment-style */
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import logoDark from '../../assets/images/commons/logo-dark.svg';
import { APIClient } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';
import AuthSlider from './authCarousel';
import { GetAuthModes, getBaseUrl } from 'Components/Common/Util';

const Login = (props: any) => {
    const api = new APIClient();
    const baseUrl = getBaseUrl();

    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const accountId = localStorage.getItem('account');
    const authModeString = GetAuthModes();
    const authModes = authModeString ? authModeString : [];

    useEffect(() => {
        if (!accountId) props.router.navigate('/account');
    }, []);

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
            const params = { tenant: accountId, username: values.username, password: values.password, app: 'portal', device: '' };
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
