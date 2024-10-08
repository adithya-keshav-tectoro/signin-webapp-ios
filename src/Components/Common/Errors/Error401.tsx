import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

const Error401: FC = () => {
    document.title = '401 Error';
    const navigate: (path: string) => void = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const backToLogin = (): void => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <React.Fragment>
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={5}>
                                <Card className="overflow-hidden">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <h1 className="text-primary mb-4">Oops !</h1>
                                            <h4 className="text-uppercase">Sorry, Invalid Credentials</h4>
                                            <p className="text-muted mb-4">The page you are looking for is not available</p>
                                            <button type="button" onClick={backToLogin} className="btn btn-success">
                                                Back to Login
                                            </button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Error401;
