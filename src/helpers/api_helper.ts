/* eslint-disable no-shadow */
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { toast } from 'react-toastify';
import { store } from 'slices/persistor';

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// content type
const authUser: any = sessionStorage.getItem('authUser');
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

// intercepting to capture errors
axios.interceptors.response.use(
    function (response: any) {
        return response.data ? response.data : response;
    },
    function (error: any) {
        /*
         * Any status codes that falls outside the range of 2xx cause this function to trigger
         */
        if (!navigator.onLine) window.location.href = '/#/auth-offline';
        let message;
        switch (error.response.status) {
            case 500:
                // message = 'Internal Server Error';
                window.location.href = '/#/auth-500';
                break;
            case 502:
                message = 'Bad Gateway';
                break;
            case 503:
                message = 'Server maintenance';
                window.location.href = '/#/maintenance';
                break;
            case 401:
                // message = 'Invalid Credentials';
                window.location.href = '/#/auth-401';
                break;
            case 404:
                // message = 'Sorry! the data you are looking for could not be found';
                window.location.href = '/#/auth-404';
                break;
            case 403:
                return Promise.reject(error.response.status);
            default:
                message = error?.response?.data?.errors?.[0] || error.response.data.error || error;
                toast.error(message);
                return Promise.reject(message);
        }
    }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

const setAxiosBaseUrl = (url: any) => {
    axios.defaults.baseURL = url;
};

class APIClient {
    /**
     * Fetches data from the given URL
     */
    get = (url: string, params?: any): Promise<AxiosResponse> => {
        let response: Promise<AxiosResponse>;

        const paramKeys: string[] = [];

        if (params) {
            Object.keys(params).map((key) => {
                paramKeys.push(key + '=' + params[key]);
                return paramKeys;
            });

            const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
            response = axios.get(`${url}?${queryString}`, params);
        } else {
            response = axios.get(`${url}`, params);
        }

        return response;
    };

    /**
     * Posts the given data to the URL
     */
    create = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.post(url, data);
    };

    /**
     * Updates data
     */
    update = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.patch(url, data);
    };

    put = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.put(url, data);
    };

    /**
     * Deletes data
     */
    delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
        return axios.delete(url, { ...config });
    };
}

const getLoggedinUser = () => {
    const user = store.getState()?.Login?.user;
    if (!user) return null;
    return user;
};

export { APIClient, setAuthorization, setAxiosBaseUrl, getLoggedinUser };
