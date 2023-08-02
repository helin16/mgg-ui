
export const STORAGE_COLUMN_KEY_STAFF_LIST = 'cols_staff_list';

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
  } catch {
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
