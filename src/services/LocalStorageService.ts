
export const STORAGE_COLUMN_KEY_STAFF_LIST = 'cols_staff_list';
export const STORAGE_COLUMN_KEY_STUDENT_LIST = 'cols_student_list';
export const STORAGE_COLUMN_KEY_MY_CLASS_LIST = 'cols_my_class_list';
export const STORAGE_COLUMN_KEY_CAMPUS_DISPLAY_SLIDES = 'cd_slides';

const getTokenName = () => {
  return process.env.REACT_APP_LOCAL_USER_TOKEN_NAME || 'token';
};

const getToken = () => {
  return localStorage.getItem(getTokenName());
};

const setToken = (newToken: string) => {
  return localStorage.setItem(getTokenName(), newToken);
};

const removeToken = () => {
  return localStorage.removeItem(getTokenName());
};

const getItem = (name: string) => {
  const value = localStorage.getItem(name);
  try {
    return JSON.parse(`${value || ''}`);
  } catch {
    return value;
  }
};

const setItem = (name: string, value: any) => {
  try {
    return localStorage.setItem(name, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorageService.setItem', err);
    return localStorage.setItem(name, value);
  }
};

const removeItem = (name: string) => {
  return localStorage.removeItem(name);
};

const LocalStorageService = {
  getToken,
  setToken,
  removeToken,

  setItem,
  getItem,
  removeItem,
};

export default LocalStorageService;
