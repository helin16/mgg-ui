import AppService, {iConfigParams} from '../../AppService';
import iSynCommunitySkill from '../../../types/Synergetic/Community/iSynCommunitySkill';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = '/syn/communitySkill';

const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynCommunitySkill>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynCommunitySkillService = {
  getAll
}

export default SynCommunitySkillService;
