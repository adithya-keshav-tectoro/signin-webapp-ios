import React from 'react';
import { Card, Spinner } from 'reactstrap';

const Loader = (props: any) => {
    return (
        <React.Fragment>
            <Card className="loader-main">
                <div className="loader-box">
                    <Spinner color="primary" className="spinner-style" />
                    <strong className="loading-style">{props.loaderMsg ? props.loaderMsg : 'Loading...'}</strong>
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Loader;
