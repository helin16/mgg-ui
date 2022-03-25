import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import iUser from '../../types/user/iUser';

export type AuthState = {
  user?: iUser;
};
/**
 * Initial State
 */
const initialState: AuthState = {
};

/**
 * Actions
 */
const actions = {
  userAuthenticated: (
    state: AuthState = initialState,
    action: PayloadAction<AuthState>,
  ) => ({
    ...state,
    user: action.payload.user,
  }),
  removedAuthentication: (state: AuthState = initialState) => ({
    ...state,
    user: undefined,
  }),
};
/**
 * Slice
 */
const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: actions,
});
/**
 * action
 */
export const { userAuthenticated, removedAuthentication } = AuthSlice.actions;
/**
 * reducer
 */
export default AuthSlice.reducer;
