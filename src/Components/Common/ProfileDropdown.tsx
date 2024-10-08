import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { LoggedInUser } from './Util';

const ProfileDropdown = () => {
    // Inside your component

    const [userName, setUserName] = useState('Admin');
    const user = LoggedInUser();

    useEffect(() => {
        if (user) {
            const name = defineName();
            setUserName(name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);

    const defineName = () => {
        let name = '';
        if (user?.firstname || user?.lastname) {
            if (user?.firstname) name = user?.firstname;
            if (user?.lastname) name = name + ' ' + user?.lastname;
        } else if (user?.username) name = user?.username;
        return name;
    };

    const userLabel = () => {
        const name = userName?.split(' ');
        if (name?.length === 1) return name?.[0]?.charAt(0)?.toUpperCase();
        else return name?.[0]?.charAt(0)?.toUpperCase() + name?.[1]?.charAt(0)?.toUpperCase();
    };

    // Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <span className="rounded-circle header-profile-user border border-2 d-flex align-items-center justify-content-center fs-15 bg-success text-white">
                            {userLabel() ? userLabel() : 'NU'}
                        </span>
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text"> {userName || 'No User'}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{user?.roleName}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>

                    <DropdownItem className="p-0">
                        <Link to="/logout" className="dropdown-item">
                            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{' '}
                            <span className="align-middle" data-key="t-logout">
                                Logout
                            </span>
                        </Link>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
