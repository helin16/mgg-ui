import AppService, {iConfigParams} from '../AppService';
import iSchoolManagementTeam from '../../types/Synergetic/iSchoolManagementTeam';

const endPoint = `/smt`;
const getSchoolManagementTeams = (params: iConfigParams = {}): Promise<iSchoolManagementTeam[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const create = (params: iConfigParams, options: iConfigParams = {}): Promise<iSchoolManagementTeam> => {
  return AppService.post(endPoint, params, options).then(resp => resp.data);
};

const update = (id: number | string, params: iConfigParams, options: iConfigParams = {}): Promise<iSchoolManagementTeam> => {
  return AppService.put(`${endPoint}/${id}`, params, options).then(resp => resp.data);
};

const remove = (id: number, params: iConfigParams = {}) => {
  return AppService.delete(`${endPoint}/${id}`, params).then(resp => resp.data);
}

const SchoolManagementTeamService = {
  getSchoolManagementTeams,
  create,
  update,
  remove,
}

export default SchoolManagementTeamService;
