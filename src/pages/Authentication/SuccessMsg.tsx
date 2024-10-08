import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Container, Row } from 'reactstrap';

import AuthSlider from './authCarousel';

const SuccessMsg = () => {
    document.title = 'Success Message ';
    return (
        <React.Fragment>
            <div className="d-flex justify-content-center align-items-center overflow-y-auto">
                <Col lg={12}>
                    <Card className="overflow-x-hidden m-0">
                        <Row className="g-0 vh-100 vw-100">
                            <AuthSlider />

                            <Col lg={4} className="d-flex justify-content-center align-items-center">
                                <div className="p-lg-5 p-4 text-center">
                                    <div className="avatar-lg mx-auto mt-2">
                                        <div className="avatar-title bg-light text-success display-3 rounded-circle">
                                            <i className="ri-checkbox-circle-fill"></i>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-2">
                                        <h4>Well done !</h4>
                                        <p className="text-muted mx-4">Your password is now updated successfully.</p>
                                        <div className="mt-4">
                                            <Link to="/login" className="btn btn-success w-100">
                                                Back to Login
                                            </Link>
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

export default SuccessMsg;
