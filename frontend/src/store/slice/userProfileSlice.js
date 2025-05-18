import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
    loading: false,
    error: null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = null;
        },
        setUserProfileError: (state, action) => {
            state.profile = null;
            state.loading = false;
            state.error = action.payload;
        },
        setUserProfileLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
    },
});

export const { setUserProfile, setUserProfileError, setUserProfileLoading } =
    userProfileSlice.actions;
export default userProfileSlice.reducer;
