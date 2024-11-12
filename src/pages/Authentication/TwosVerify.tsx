/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-comment-style */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import AuthSlider from './authCarousel';
import { APIClient } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';
import * as Yup from 'yup';
import { loginUser } from 'slices/thunks';
import {
    togglePassword,
    togglePasswordChange,
    togglePasswordChangeVal,
    togglePasswordStrengthIn,
    togglePasswordStrengthOut
} from 'Components/Hooks/UserHooks';
import { toast } from 'react-toastify';
import { getBaseUrl } from 'Components/Common/Util';

const TwosVerify = () => {
    document.title = 'Two Step Verification ';
    const dispatch: any = useDispatch();
    const navigate = useNavigate();
    const api = new APIClient();
    const baseUrl = getBaseUrl();
    const accountId = localStorage.getItem('account');
    const authData = JSON.parse(localStorage.getItem('authObj') as string) || null;
    const [loading, setLoading] = useState(false);
    const [routeParam, setRouteParam] = useState('');
    const [authObj, setAuthObj] = useState(authData);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!authData) navigate('/login');
        setAuthObj(authData);
        const locationArr = window.location.hash.split('/');
        const queryString = locationArr[locationArr.length - 1];
        if (queryString === 'login-otp-verify') setRouteParam('login');
        if (queryString === 'forgot-otp-verify') setRouteParam('resetpassword');
    }, []);

    const getInputElement = (index: number): HTMLInputElement | null => {
        return document.getElementById(`digit${index}-input`) as HTMLInputElement | null;
    };

    const moveToNext = (e: any, t: any, field: any) => {
        if (e.which === 8 || e.which === 46) validation.setValues({ ...validation.values, [field.value]: '' });
        if (e.which !== 8 && e.which !== 46) 0 < e?.target?.value?.length && document.getElementById('digit' + t + '-input')?.focus();
        else document.getElementById(`digit${t - 2}-input`)?.focus();
    };

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            digitOne: '',
            digitTwo: '',
            digitThree: '',
            digitFour: '',
            digitFive: '',
            digitSix: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema:
            routeParam === 'resetpassword'
                ? Yup.object({
                      newPassword: Yup.string().matches(/^\S*$/, 'Spaces Are Not Allowed In Password').required('Please Enter New Password')
                  })
                : null,
        onSubmit: (values) => {
            setLoading(true);
            const params: any = {
                otp: `${values.digitOne}${values.digitTwo}${values.digitThree}${values.digitFour}${values.digitFive}${values.digitSix}`,
                username: authObj?.username,
                tenant: accountId,
                app: 'enroll'
            };
            if (routeParam === 'resetpassword') {
                params.password = values.newPassword;
                api.create(baseUrl + url.RESET_PASSWORD, params)
                    .then((resp: any) => {
                        if (resp.status === 'success') navigate('/successmsg');
                        setLoading(false);
                    })
                    .catch((err) => setLoading(false));
            } else {
                api.create(baseUrl + url.VALIDATE_OTP, params)
                    .then((resp: any) => {
                        if (resp.status?.toLowerCase() === 'success') {
                            dispatch(loginUser(resp.data, navigate));
                            localStorage.removeItem('authObj');
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
            }
        }
    });

    const dynamicServiceCall = (URL: string, params: any) => {
        api.create(baseUrl + URL, params)
            .then((resp: any) => {
                if (resp.status?.toLowerCase() === 'success') {
                    toast.success('OTP sent to your registered email address.');
                }
                setLoading(false);
                setSending(false);
            })
            .catch((err) => {
                setLoading(false);
                setSending(false);
            });
    };

    const handleClickResend = () => {
        validation.setValues({
            ...validation.values,
            digitOne: '',
            digitTwo: '',
            digitThree: '',
            digitFour: '',
            digitFive: '',
            digitSix: '',
            newPassword: '',
            confirmPassword: ''
        });
        setSending(true);
        document.getElementById('digit1-input')?.focus();
        if (routeParam === 'login') {
            const params = { username: authObj.username, password: authObj.password, tenant: accountId };
            dynamicServiceCall(url.LOGIN, params);
        } else {
            const params = { username: authObj.username, tenant: accountId };
            dynamicServiceCall(url.FORGOT_PASSWORD, params);
        }
    };
    const handleConfirmPassword = (e: any) => {
        validation.setValues({ ...validation.values, confirmPassword: e.target.value });
        validation.setTouched({ ...validation.touches, confirmPassword: true });
        validation.setErrors({
            ...validation.errors,
            confirmPassword:
                e.target.value === ''
                    ? 'Please Enter Confirm Password'
                    : e.target.value !== validation.values.newPassword
                    ? 'Password did not match'
                    : ''
        });
    };

    const handleOtpChange = (e: any, field: any) => {
        const pattern: any = new RegExp(/^[0-9\b]+$/);
        const result: any = pattern.test(e.target.value);
        return result;
    };

    const fieldsArray: any = [
        { id: 'digit1-input', value: 'digitOne', index: 0 },
        { id: 'digit2-input', value: 'digitTwo', index: 1 },
        { id: 'digit3-input', value: 'digitThree', index: 2 },
        { id: 'digit4-input', value: 'digitFour', index: 3 },
        { id: 'digit5-input', value: 'digitFive', index: 4 },
        { id: 'digit6-input', value: 'digitSix', index: 5 }
    ];

    const handlePaste = (e: any) => {
        const value: any = JSON.stringify(e.clipboardData.getData('text/plain'))?.split('');
        const values: any = value?.slice(1, value.length - 1);
        validation.setValues({
            ...validation.values,
            digitOne: values[0] ? values[0] : '',
            digitTwo: values[1] ? values[1] : '',
            digitThree: values[2] ? values[2] : '',
            digitFour: values[3] ? values[3] : '',
            digitFive: values[4] ? values[4] : '',
            digitSix: values[5] ? values[5] : ''
        });
        document.getElementById(`digit${values.length}-input`)?.focus();
    };

    const clearOTP = () => {
        validation.setValues({
            ...validation.values,
            digitOne: '',
            digitTwo: '',
            digitThree: '',
            digitFour: '',
            digitFive: '',
            digitSix: ''
        });
        document.getElementById('digit1-input')?.focus();
    };

    const handleKeyDown = (e: any) => {
        // console.log(e);
    };

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center align-items-center overflow-y-auto">
                <Col lg={12}>
                    <Card className="overflow-x-hidden m-0">
                        <Row className="g-0 vh-100 vw-100">
                            <AuthSlider />

                            <Col lg={4} className="d-flex justify-content-center align-items-center">
                                <div className="w-100 p-lg-12 p-6">
                                    <div className="p-lg-4 p-4">
                                        <div className="mb-4">
                                            <div className="avatar-lg mx-auto">
                                                <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                                                    <i className="ri-mail-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-muted text-center mx-lg-3">
                                            <h4 className="">Verify Your Email</h4>
                                            <p>Please enter the 6 digit OTP sent to your Email</p>
                                        </div>

                                        <div className="mt-4 px-4">
                                            <Form
                                                autoComplete="off"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                            >
                                                <div className="d-flex justify-content-center flex-row verifyOTP mb-1 text-center">
                                                    {fieldsArray?.map((field: any, index: any) => {
                                                        return (
                                                            <div className="d-flex flex-column" key={index}>
                                                                <Input
                                                                    key={index}
                                                                    onKeyUp={(e) => moveToNext(e, index + 2, field)}
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    maxLength={1}
                                                                    className={'form-control mx-2 text-center'}
                                                                    id={field.id}
                                                                    autoFocus={index === 0}
                                                                    name={field.value}
                                                                    onKeyDown={(e) => handleKeyDown(e)}
                                                                    onPaste={handlePaste}
                                                                    autoComplete="off"
                                                                    onChange={(e) => {
                                                                        if (handleOtpChange(e, field)) validation.handleChange(e);
                                                                    }}
                                                                    value={validation.values[field.value] || ''}
                                                                />
                                                                {index === 5 && (
                                                                    <div
                                                                        className="d-flex align-items-center mt-3 cursor-pointer"
                                                                        onClick={clearOTP}
                                                                    >
                                                                        <span className="text-decoration-underline text-primary ps-2">
                                                                            Clear
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {routeParam === 'resetpassword' && (
                                                    <>
                                                        <div className="text-center pt-2">
                                                            <h5 className="text-primary">Create new password</h5>
                                                            <p className={'text-muted'}>
                                                                Your new password must be different from previous used password.
                                                            </p>
                                                        </div>

                                                        <div className="mb-4">
                                                            <Label className="form-label">New Password</Label>
                                                            <div className="position-relative auth-pass-inputgroup">
                                                                <Input
                                                                    onFocus={() => togglePasswordStrengthIn('password-contain')}
                                                                    togglePasswordStrengthIn
                                                                    onBlur={(e) => {
                                                                        validation.handleBlur(e);
                                                                        togglePasswordChangeVal(validation.values.newPassword) &&
                                                                            togglePasswordStrengthOut('password-contain');
                                                                    }}
                                                                    name="newPassword"
                                                                    type="password"
                                                                    autoComplete="new-password"
                                                                    className={'form-control pe-5 password-input'}
                                                                    onPaste={() => false}
                                                                    placeholder="Enter new password"
                                                                    id="password-input"
                                                                    aria-describedby="passwordInput"
                                                                    required
                                                                    onChange={(e) => {
                                                                        validation.handleChange(e);
                                                                        togglePasswordChange(e.target.value);
                                                                    }}
                                                                    value={validation.values.newPassword || ''}
                                                                    invalid={
                                                                        validation.touched.newPassword && validation.errors.newPassword
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                {validation.touched.newPassword && validation.errors.newPassword ? (
                                                                    <FormFeedback type="invalid">
                                                                        <div>{validation.errors.newPassword}</div>
                                                                    </FormFeedback>
                                                                ) : null}
                                                                {validation.values.newPassword &&
                                                                    validation.values.newPassword !== '' &&
                                                                    !validation.errors.newPassword && (
                                                                        <Button
                                                                            color="link"
                                                                            className="position-absolute end-0 top-0 text-decoration-none cursor-auto text-muted password-addon"
                                                                            type="button"
                                                                        >
                                                                            <i
                                                                                id="password-icon1"
                                                                                onClick={() =>
                                                                                    togglePassword('password-input', 'password-icon1')
                                                                                }
                                                                                className="ri-eye-off-line align-middle cursor-pointer"
                                                                            ></i>
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                            <div id="passwordInput" className={'form-text'}>
                                                                Must be at least 8 characters.
                                                            </div>
                                                        </div>
                                                        <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                            <h5 className="fs-13">Password must contain:</h5>
                                                            <p id="pass-length" className="invalid fs-12 mb-2">
                                                                Minimum <b>8 characters</b>
                                                            </p>
                                                            <p id="pass-max-length" className="invalid fs-12 mb-2">
                                                                Maximum <b>12 characters</b>
                                                            </p>
                                                            <p id="pass-lower" className="invalid fs-12 mb-2">
                                                                At least 1 <b>lowercase</b> letter (a-z)
                                                            </p>
                                                            <p id="pass-upper" className="invalid fs-12 mb-2">
                                                                At least 1 <b>uppercase</b> letter (A-Z)
                                                            </p>
                                                            <p id="pass-number" className="invalid fs-12 mb-2">
                                                                At least 1 <b>number</b> (0-9)
                                                            </p>
                                                            <p id="pass-special" className="invalid fs-12 mb-0">
                                                                At least 1 <b>Special</b> Symbol
                                                            </p>
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label className="form-label">Confirm Password</Label>
                                                            <div className="position-relative auth-pass-inputgroup mb-4">
                                                                <Input
                                                                    disabled={!togglePasswordChangeVal(validation.values.newPassword)}
                                                                    type="password"
                                                                    className={'form-control pe-5 password-input'}
                                                                    onPaste={() => false}
                                                                    placeholder="Confirm password"
                                                                    id="password-input1"
                                                                    required
                                                                    name="confirmPassword"
                                                                    onChange={(e) => {
                                                                        handleConfirmPassword(e);
                                                                    }}
                                                                    value={validation.values.confirmPassword || ''}
                                                                    invalid={
                                                                        validation.touched.confirmPassword &&
                                                                        (validation.errors.confirmPassword ||
                                                                            validation.values.confirmPassword !==
                                                                                validation.values.newPassword)
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                {validation.touched.confirmPassword ? (
                                                                    <FormFeedback type="invalid">
                                                                        <div>
                                                                            {validation.errors.confirmPassword
                                                                                ? validation.errors.confirmPassword
                                                                                : validation.values.confirmPassword !==
                                                                                  validation.values.newPassword
                                                                                ? 'Passwords did not match.'
                                                                                : ''}
                                                                        </div>
                                                                    </FormFeedback>
                                                                ) : null}
                                                                {validation.values.confirmPassword &&
                                                                    validation.values.confirmPassword !== '' &&
                                                                    !validation.errors.confirmPassword && (
                                                                        <Button
                                                                            color="link"
                                                                            className={`position-absolute top-0 text-decoration-none cursor-auto text-muted password-addon ${
                                                                                validation.values.confirmPassword !==
                                                                                validation.values.newPassword
                                                                                    ? 'margin-end-20 end-0'
                                                                                    : 'end-0'
                                                                            }`}
                                                                            type="button"
                                                                        >
                                                                            <i
                                                                                id="password-icon2"
                                                                                onClick={() =>
                                                                                    togglePassword('password-input1', 'password-icon2')
                                                                                }
                                                                                className="ri-eye-off-line align-middle cursor-pointer"
                                                                            ></i>
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="mt-4">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        className="w-100"
                                                        disabled={
                                                            loading ||
                                                            (routeParam === 'resetpassword' &&
                                                                (validation.values.confirmPassword === '' ||
                                                                    validation.errors.newPassword ||
                                                                    validation.values.confirmPassword !== validation.values.newPassword)) ||
                                                            validation.values?.digitOne === '' ||
                                                            validation.values?.digitTwo === '' ||
                                                            validation.values?.digitThree === '' ||
                                                            validation.values?.digitFour === '' ||
                                                            validation.values?.digitFive === '' ||
                                                            validation.values?.digitSix === ''
                                                        }
                                                    >
                                                        <span className="d-flex align-items-center justify-content-center">
                                                            Confirm
                                                            {loading && (
                                                                <span className="ms-2 spinner-border" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </span>
                                                            )}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <div className="mb-0 d-flex align-items-center justify-content-center">
                                                Didn't receive a code ?
                                                <div
                                                    className={`fw-bold ${
                                                        sending ? 'text-muted' : 'text-decoration-underline cursor-pointer text-primary'
                                                    } ps-1`}
                                                    onClick={sending ? undefined : handleClickResend}
                                                >
                                                    Resend
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <div className="mb-0 d-flex align-items-center justify-content-center">
                                                <Link to={'/login'} className="fw-semibold text-primary text-decoration-underline">
                                                    Not my User Name.
                                                </Link>
                                            </div>
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

export default TwosVerify;
