import { configureStore, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import AppReducer from './reduxers/app.slice';
import AuthReducer from './reduxers/auth.slice';

const reducers = {
  app: AppReducer,
  auth: AuthReducer,
};

const getCombinedReducer = () => combineReducers(reducers);

const store = configureStore({
  reducer: getCombinedReducer(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;
