import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navdata = () => {
    const history = useNavigate();
    // state data
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute('sub-items')) {
            const ul: any = document.getElementById('two-column-menu');
            const iconItems: any = ul.querySelectorAll('.nav-icon.active');
            const activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove('active');
                const id = item.getAttribute('sub-items');
                const getID = document.getElementById(id) as HTMLElement;
                if (getID) getID.classList.remove('show');
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState === 'Dashboard' && window.location.hash === '#/dashboard') {
            history('/dashboard');
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState === 'Tenant Master' && window.location.hash === '#/tenantmaster') {
            history('/tenantmaster');
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState === 'License Requests') {
            history('/license');
            document.body.classList.add('twocolumn-panel');
        }
    }, [history, iscurrentState]);

    const menuItems: any = [
        // { label: 'Menu', isHeader: true },
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'ri-dashboard-2-line',
            link: '/dashboard',
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            }
        }
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
