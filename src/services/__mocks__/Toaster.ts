export const TOAST_TYPE_INFO = 'info';
export const TOAST_TYPE_SUCCESS = 'success';
export const TOAST_TYPE_WARNING = 'warn';
export const TOAST_TYPE_ERROR = 'error';
export const TOAST_TYPE_DEFAULT = 'default';

const Toaster = {
  showApiError: jest.fn(),
  showToast: jest.fn(),
};

export default Toaster;
