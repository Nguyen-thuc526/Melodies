// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    refreshToken: null,
    user: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        logout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const { setToken, setRefreshToken, setUser, logout, setAuthError } =
    authSlice.actions;
export default authSlice.reducer;
