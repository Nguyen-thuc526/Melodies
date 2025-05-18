import { combineReducers } from 'redux';
import authSlice from './slice/authSlice';
import userProfileReducer from './slice/userProfileSlice';
const rootReducer = combineReducers({
    auth: authSlice,
    userProfile: userProfileReducer,
});

export default rootReducer;
