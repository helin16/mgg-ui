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

const LocalStorageService = {
  getToken,
  setToken,
  removeToken,
};

export default LocalStorageService;
