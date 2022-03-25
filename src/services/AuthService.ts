import AppService from './AppService';

const endPoint = `/auth`

const authSchoolBox = (synId: string, schoolBoxUser: string, time: number, key: string) => {
  return AppService.post(`${endPoint}/schoolbox`, {synId, schoolBoxUser, time, key}).then(resp => resp.data);
};

const AuthService = {
  authSchoolBox
}

export default AuthService;
