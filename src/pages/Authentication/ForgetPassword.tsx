import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Form, FormFeedback, Label, Input } from 'reactstrap';

import AuthSlider from './authCarousel';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { APIClient } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';
import { toast } from 'react-toastify';
import { getBaseUrl } from 'Components/Common/Util';

const ForgetPassword = () => {
    document.title = 'Reset Password ';

    const api = new APIClient();
    const baseUrl = getBaseUrl();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            username: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Please Enter Your Email')
        }),
        onSubmit: (values) => {
            setLoading(true);
            const params = { username: values.username, tenant: 'TT' };
            api.create(baseUrl + url.FORGOT_PASSWORD, params)
                .then((resp: any) => {
                    if (resp.status?.toLowerCase() === 'success') {
                        toast.success('OTP sent to your registered email address.');
                        localStorage.setItem('authObj', JSON.stringify({ username: values.username }));
                        navigate('/forgot-otp-verify');
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    });

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
                                        <div className="mt-2 text-center">
                                            <h5 className="text-primary">Forgot Password?</h5>
                                            <p className="text-muted">Reset password with Tectoro EMM</p>
                                            <i className="ri-mail-send-line display-5 text-success"></i>
                                        </div>

                                        <div className="alert border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                            OTP will be sent to your Email ID
                                        </div>
                                        <div className="p-2">
                                            <Form onSubmit={validation.handleSubmit}>
                                                <div className="mb-4">
                                                    <Label className="form-label">User Name</Label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        placeholder="Enter User Name"
                                                        name="username"
                                                        value={validation.values.username}
                                                        onBlur={validation.handleBlur}
                                                        onChange={validation.handleChange}
                                                        invalid={validation.errors.username && validation.touched.username ? true : false}
                                                    />
                                                    {validation.errors.username && validation.touched.username ? (
                                                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="text-center mt-4">
                                                    <Button
                                                        color="success"
                                                        className="w-100"
                                                        type="submit"
                                                        disabled={
                                                            validation.values.username === '' || !!validation.errors.username || loading
                                                        }
                                                    >
                                                        Send OTP
                                                        {loading && (
                                                            <span className="ms-2 spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <p className="mb-0">
                                                Wait, I remember my password...
                                                <Link to="/login" className="fw-bold text-primary text-decoration-underline">
                                                    Click here
                                                </Link>
                                            </p>
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

export default ForgetPassword;
