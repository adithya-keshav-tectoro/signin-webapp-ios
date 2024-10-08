import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import error400cover from '../../../assets/images/commons/error400-cover.png';

const Error404 = () => {
    document.title = '404 Error';
    const navigate = useNavigate();

    const backToLogin = (): void => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
                    <div className="auth-page-content overflow-hidden p-0">
                        <Container>
                            <Row className="justify-content-center">
                                <Col xl={7} lg={8}>
                                    <div className="text-center">
                                        <img src={error400cover} alt="error img" className="img-fluid" />
                                        <div className="mt-3">
                                            <h3 className="text-uppercase">Sorry, Page not Found 😭</h3>
                                            <p className="text-muted mb-4">The page you are looking for not available!</p>
                                            <button type="button" onClick={backToLogin} className="btn btn-success">
                                                Back to Login
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Error404;
