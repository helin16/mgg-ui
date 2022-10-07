import { toast } from 'react-toastify';

export const TOAST_TYPE_INFO = 'info';
export const TOAST_TYPE_SUCCESS = 'success';
export const TOAST_TYPE_WARNING = 'warn';
export const TOAST_TYPE_ERROR = 'error';
export const TOAST_TYPE_DEFAULT = 'default';

const showToast = (msg: string, type?: string, options = {}) => {
  const toastOptions = {
    theme: "colored",
    type,
    ...options,
  }
  // @ts-ignore
  return toast(msg, toastOptions)
}

const showApiError = (error: any) => {
  console.error(error);
  return showToast(error.message, TOAST_TYPE_ERROR);
}

const Toaster = {
  showToast,
  showApiError,
}

export default Toaster
