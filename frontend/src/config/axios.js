import axios from 'axios';
import { store } from '../store/store';
import { API_URL } from '../constant';
import { logout } from '../store/slice/authSlice';

const config = {
    baseURL: API_URL,
    timeout: 30000,
};

const api = axios.create(config);

const getReduxToken = () => store.getState().auth.token;

api.interceptors.request.use((config) => {
    const token = getReduxToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, Promise.reject);

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.assign('/login');
        }

        return Promise.reject(error);
    }
);

export default api;
