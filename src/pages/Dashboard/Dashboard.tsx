/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-inline-styles/no-inline-styles */
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import React, { useEffect, useState } from 'react';
import { getBaseUrl, LoggedInUser } from 'Components/Common/Util';
import { APIClient } from 'helpers/api_helper';
import * as url from 'helpers/url_helper';

const Dashboard = () => {
    document.title = 'Dashboard';
    const api = new APIClient();
    const baseUrl = getBaseUrl();

    const [show, setShow] = useState(false);
    const [idError, setIdError] = useState<any>('');
    const [dynamicToken, setDynamicToken] = useState('');

    const user = LoggedInUser();

    const navigateToBrowser = () => {
        const a = document.createElement('a');
        a.href = `https://enterprise.google.com/android/enroll/?et=${dynamicToken}`;
        // a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    async function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        const provisioningInfoPath = urlParams.get('provisioningInfo');
        const idPath = urlParams.get('id');

        if (provisioningInfoPath && provisioningInfoPath?.split('/')?.length > 1) {
            api.get(
                baseUrl +
                    url.GET_TOKEN +
                    `?id=${idPath}&provisionInfo=${provisioningInfoPath?.split('/')[1]}&userName=${user.username ? user.username : ''}`
            )
                .then((resp: any) => {
                    if (resp.status.toLowerCase() === 'success') {
                        setDynamicToken(resp.data);
                    } else {
                        setShow(true);
                        setIdError(resp);
                    }
                })
                .catch((error) => {
                    setShow(true);
                    setIdError(error);
                });
        } else {
            setShow(true);
            setIdError('provisionInfo Error');
        }
    }

    useEffect(() => {
        // fetchData();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Dashboard" pageTitle="Dashboard" backLink="" />
                    <div className="pt-3" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <h3>Welcome</h3>
                        {/* {!idError && (
                            <div className=" justify-content-center pt-2">
                                <button onClick={navigateToBrowser}>Click here to navigate</button>
                            </div>
                        )}
                        {show && <div className="pt-3">Error: {idError ? JSON.stringify(idError) : ''}</div>} */}
                        {/* <div>Host:{JSON.stringify(window.location.host)}</div>
                        <div>Params: {JSON.stringify(window.location.search)}</div>
                        <div>Token: {dynamicToken ? JSON.stringify(dynamicToken) : JSON.stringify(idError)} </div> */}
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;
