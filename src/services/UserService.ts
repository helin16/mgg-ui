import AppService, {iConfigParams} from './AppService';
import iModuleUser from '../types/modules/iModuleUser';

const endPoint = `/user`;

const getUsers = (params: iConfigParams = {}): Promise<iModuleUser[]> => {
  return AppService.get(`${endPoint}`, params).then(resp => resp.data);
};

const deleteUser = (moduleId: string | number, roleId: string | number, synergeticId: string | number): Promise<{ deleted: boolean }> => {
  return AppService.delete(`${endPoint}/${moduleId}/${roleId}/${synergeticId}`).then(resp => resp.data);
};


const createUser = (moduleId: string | number, roleId: string | number, synergeticId: string | number, params: iConfigParams = {}): Promise<iModuleUser> => {
  return AppService.post(`${endPoint}/${moduleId}/${roleId}/${synergeticId}`, params).then(resp => resp.data);
};

const updateUser = (moduleId: string | number, roleId: string | number, synergeticId: string | number, params: iConfigParams): Promise<iModuleUser> => {
  return AppService.put(`${endPoint}/${moduleId}/${roleId}/${synergeticId}`, params).then(resp => resp.data);
};

const UserService = {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
}

export default UserService;
