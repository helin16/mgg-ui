import AppService, {iConfigParams} from '../AppService';
import iSchoolManagementTeam from '../../types/Synergetic/iSchoolManagementTeam';
import iMessage from '../../types/Message/iMessage';

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

const copyAllPreviousToCurrent = (params: iConfigParams = {}, options: iConfigParams = {}): Promise<iMessage> => {
  return AppService.post(`${endPoint}/copyToCurrent`, params, options).then(resp => resp.data);
}

const remove = (id: number, params: iConfigParams = {}) => {
  return AppService.delete(`${endPoint}/${id}`, params).then(resp => resp.data);
}

const SchoolManagementTeamService = {
  getSchoolManagementTeams,
  create,
  copyAllPreviousToCurrent,
  update,
  remove,
}

export default SchoolManagementTeamService;
