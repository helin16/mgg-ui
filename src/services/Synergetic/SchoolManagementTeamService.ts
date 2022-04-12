import AppService, {iConfigParams} from '../AppService';
import iSchoolManagementTeam from '../../types/Synergetic/iSchoolManagementTeam';

const getSchoolManagementTeams = (params: iConfigParams = {}): Promise<iSchoolManagementTeam[]> => {
  return AppService.get(`/smt`, params).then(resp => resp.data);
};

const SchoolManagementTeamService = {
  getSchoolManagementTeams,
}

export default SchoolManagementTeamService;
