import AppService from './AppService';
import iRole from '../types/modules/iRole';

const endPoint = `/auth`

const authSchoolBox = (synId: string, schoolBoxUser: string, time: number, key: string) => {
  return AppService.post(`${endPoint}/schoolbox`, {synId, schoolBoxUser, time, key}).then(resp => resp.data);
};

const canAccessModule = (moduleId: string | number): Promise<{[key: number]: {canAccess: boolean; role?: iRole}}> => {
  return AppService.get(`${endPoint}/canAccess?moduleId=${moduleId}`).then(resp => resp.data);
};

const AuthService = {
  authSchoolBox,
  canAccessModule,
}

export default AuthService;
