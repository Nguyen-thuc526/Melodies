import api from '../../config/axios';
import { setToken, setUser } from '../slice/authSlice';
import { store } from '../store';

export const registerUser = async (
    username,
    email,
    password,
    confirmPassword
) => {
    try {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password,
            confirmPassword,
        });

        if (response.data.success) {
            const { token, user } = response.data;
            if (token) store.dispatch(setToken(token));

            return user;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Registration failed'
        );
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', {
            email,
            password,
        });

        const { success, token, user } = response.data;
        if (success) {
            if (token) store.dispatch(setToken(token));
            store.dispatch(setUser(user));
        }

        return user;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(
            error.response?.data?.message || error.message || 'Login failed'
        );
    }
};
