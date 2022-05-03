import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  isProd?: boolean;
};
/**
 * Initial State
 */
const initialState: AppState = {
};

/**
 * Actions
 */
const actions = {
  setIsProd: (
    state: AppState = initialState,
    action: PayloadAction<AppState>,
  ) => ({
    ...state,
    isProd: action.payload.isProd,
  }),
};
/**
 * Slice
 */
const AppSlice = createSlice({
  name: 'App',
  initialState,
  reducers: actions,
});
/**
 * action
 */
export const { setIsProd } = AppSlice.actions;
/**
 * reducer
 */
export default AppSlice.reducer;
