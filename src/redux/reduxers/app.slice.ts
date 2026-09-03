import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  isProd?: boolean;
  backendSchoolBoxUrl?: string;
  // Feature 023: whether the current SchoolBox session is impersonating another user.
  // Resolved once at app boot by ImpersonationHelper; read from here by all consumers.
  isImpersonating?: boolean;
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
    backendSchoolBoxUrl: action.payload.backendSchoolBoxUrl,
  }),
  setImpersonation: (
    state: AppState = initialState,
    action: PayloadAction<{ isImpersonating: boolean }>,
  ) => ({
    ...state,
    isImpersonating: action.payload.isImpersonating,
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
export const { setIsProd, setImpersonation } = AppSlice.actions;
/**
 * reducer
 */
export default AppSlice.reducer;
