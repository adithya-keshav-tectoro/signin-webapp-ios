/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import AuthSlider from './authCarousel';
import logoDark from '../../assets/images/commons/logo-dark.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { APIClient, setAxiosBaseUrl } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';
import { useDispatch } from 'react-redux';
import { authModesAction, loginUser, setBaseUrl } from 'slices/thunks';
import { useNavigate } from 'react-router-dom';
import Loader from 'Components/Common/Loader';
import { toast } from 'react-toastify';
import { getBaseUrl } from 'Components/Common/Util';

const Account = () => {
    const api = new APIClient();
    const dispatch: any = useDispatch();
    const baseUrl = getBaseUrl();
    const [loading, setLoading] = useState(false);
    const [loadingConfig, setLoadingConfig] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [failedToLoadConfig, setFailedToLoadConfig] = useState(false);
    const navigate = useNavigate();

    const fieldsArray: any = [
        { id: 'digit1-input', value: 'digitOne', index: 0 },
        { id: 'digit2-input', value: 'digitTwo', index: 1 },
        { id: 'digit3-input', value: 'digitThree', index: 2 },
        { id: 'digit4-input', value: 'digitFour', index: 3 }
    ];

    useEffect(() => {
        localStorage.clear();
        const urlParams = new URLSearchParams(window.location.search);
        localStorage.setItem('queryParams', urlParams.toString());
        const idPath = urlParams.get('id');
        const baseUrlPath = urlParams.get('source');

        if (idPath && baseUrlPath) {
            getConfig(idPath, baseUrlPath);
            dispatch(setBaseUrl(baseUrlPath));
            setAxiosBaseUrl(baseUrlPath);
        } else {
            setFailedToLoadConfig(true);
            toast.error('Failed to load Config');
        }
    }, []);

    const getConfig = (idPath: any, baseUrlPath: any) => {
        setLoadingConfig(true);
        api.get(baseUrlPath + url.CONFIG + idPath)
            .then((resp: any) => {
                if (resp.status.toLowerCase() === 'success') {
                    if (resp.data?.authtype === 'STATIC_PIN') {
                        setShowPin(true);
                    }
                } else {
                    setFailedToLoadConfig(true);
                    toast.error('Failed to load Config');
                }
            })
            .catch((err) => {
                setFailedToLoadConfig(true);
                toast.error('Failed to load Config');
            })
            .finally(() => {
                setLoadingConfig(false);
            });
    };

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: { account: '', digitOne: '', digitTwo: '', digitThree: '', digitFour: '' },
        validationSchema: !showPin
            ? Yup.object({
                  account: Yup.string().required('Please Enter Your Account ID.')
              })
            : null,
        onSubmit: (values) => {
            if (!showPin) onVerify(values);
            else onPinSubmit(values);
        }
    });

    const onPinSubmit = (values: any) => {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const idPath = urlParams.get('id');
        const params = {
            id: idPath,
            pin: `${values.digitOne}${values.digitTwo}${values.digitThree}${values.digitFour}`
        };
        api.create(baseUrl + url.VALIDATE_PIN, params)
            .then((resp: any) => {
                if (resp.status.toLowerCase() === 'success') {
                    dispatch(loginUser({}, navigate));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onVerify = (values: any) => {
        setLoading(true);
        api.get(baseUrl + url.AUTH_MODES + values.account, { status: 'A' })
            .then((resp: any) => {
                if (resp.status.toLowerCase() === 'success' && resp.data) {
                    localStorage.setItem('account', values.account?.trim(' '));
                    resp.data = resp.data ? resp.data : [];
                    dispatch(authModesAction(resp.data, navigate));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAccountIDChange = (e: any) => {
        validation.setValues({ ...validation.values, account: e.target.value?.trim(' ')?.toUpperCase() });
    };

    const moveToNext = (e: any, t: any, field: any) => {
        if (e.which === 8 || e.which === 46) validation.setValues({ ...validation.values, [field.value]: '' });
        if (e.which !== 8 && e.which !== 46) 0 < e?.target?.value?.length && document.getElementById('digit' + t + '-input')?.focus();
        else document.getElementById(`digit${t - 2}-input`)?.focus();
    };

    const handlePaste = (e: any) => {
        const value: any = JSON.stringify(e.clipboardData.getData('text/plain'))?.split('');
        const values: any = value?.slice(1, value.length - 1);
        validation.setValues({
            ...validation.values,
            digitOne: values[0] ? values[0] : '',
            digitTwo: values[1] ? values[1] : '',
            digitThree: values[2] ? values[2] : '',
            digitFour: values[3] ? values[3] : ''
        });
        document.getElementById(`digit${values.length}-input`)?.focus();
    };

    const clearOTP = () => {
        validation.setValues({
            ...validation.values,
            digitOne: '',
            digitTwo: '',
            digitThree: '',
            digitFour: ''
        });
        document.getElementById('digit1-input')?.focus();
    };

    const handleOtpChange = (e: any, field: any) => {
        const pattern = new RegExp(/^[0-9\b]+$/);
        const result = pattern.test(e.target.value);
        return result;
    };

    return (
        <React.Fragment>
            {loadingConfig && <Loader loaderMsg={'Loading Config...'} />}
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
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#"
                                            >
                                                <div className="d-flex align-items-center justify-content-center mb-1">
                                                    <p className={'fs-18 mb-0 fw-medium text-primary'}>Login Account</p>
                                                </div>
                                                {failedToLoadConfig ? (
                                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                                        <p className={'fs-14 mb-0 fw-medium '}>Failed to Load Config</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {!showPin ? (
                                                            <>
                                                                <div className="mb-4">
                                                                    <Label className="form-label">Account ID</Label>
                                                                    <Input
                                                                        name="account"
                                                                        className={'form-control'}
                                                                        placeholder="Enter Account ID"
                                                                        type="text"
                                                                        onChange={handleAccountIDChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.account || ''}
                                                                        invalid={
                                                                            validation.touched.account && validation.errors.account
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    />
                                                                    {validation.touched.account && validation.errors.account ? (
                                                                        <FormFeedback type="invalid">
                                                                            {validation.errors.account}
                                                                        </FormFeedback>
                                                                    ) : null}
                                                                </div>
                                                                <div className="mt-6">
                                                                    <button
                                                                        type="submit"
                                                                        className={'btn btn-success btn-load w-100'}
                                                                        disabled={validation.values.account === '' || loading}
                                                                    >
                                                                        <span className="d-flex align-items-center justify-content-center">
                                                                            Verify Account
                                                                            {loading && (
                                                                                <span className="ms-2 spinner-border" role="status">
                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="d-flex justify-content-center flex-row verifyOTP mt-4 mb-1 text-center">
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
                                                                                    onPaste={handlePaste}
                                                                                    autoComplete="off"
                                                                                    onChange={(e) => {
                                                                                        if (handleOtpChange(e, field))
                                                                                            validation.handleChange(e);
                                                                                    }}
                                                                                    value={validation.values[field.value] || ''}
                                                                                />
                                                                                {index === 3 && (
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
                                                                <div className="mt-4">
                                                                    <Button
                                                                        color="success"
                                                                        type="submit"
                                                                        className="w-100"
                                                                        disabled={
                                                                            loading ||
                                                                            validation.values?.digitOne === '' ||
                                                                            validation.values?.digitTwo === '' ||
                                                                            validation.values?.digitThree === '' ||
                                                                            validation.values?.digitFour === ''
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
                                                            </>
                                                        )}
                                                    </>
                                                )}
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

export default Account;
