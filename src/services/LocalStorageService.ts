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

const getCompanyIdName = () => {
  return process.env.REACT_APP_LOCAL_COMPANY_ID_NAME || 'companyId';
};

const getCompanyId = () => {
  return localStorage.getItem(getCompanyIdName());
};

const setCompanyId = (newToken: string) => {
  return localStorage.setItem(getCompanyIdName(), newToken);
};

const removeCompanyId = () => {
  return localStorage.removeItem(getCompanyIdName());
};

export default {
  getToken,
  setToken,
  removeToken,
  getCompanyId,
  setCompanyId,
  removeCompanyId,
};
