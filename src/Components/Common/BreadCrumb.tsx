import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

interface BreadCrumbProps {
    title?: string;
    pageTitle?: string;
    backLink?: any;
    showBack?: boolean;
    customBack?: any;
}

const BreadCrumb = ({ title, pageTitle, backLink, showBack, customBack }: BreadCrumbProps) => {
    const navigate = useNavigate();
    const handleBack = () => {
        if (customBack) backLink();
        else if (backLink) navigate('/' + backLink);
    };
    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0 d-flex align-items-center">
                            {showBack && (
                                <span className="link-primary me-2 cursor-pointer" onClick={handleBack}>
                                    <i className="ri-arrow-left-line" />
                                </span>
                            )}
                            {title}
                        </h4>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BreadCrumb;
