import React from 'react';

// import Scss
import './assets/scss/themes.scss';

// imoprt Route
import Route from './Routes';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <React.Fragment>
            <ToastContainer
                theme="colored"
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                limit={0}
            />
            <Route />
        </React.Fragment>
    );
}

export default App;
