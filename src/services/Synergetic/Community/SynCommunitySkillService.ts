import AppService, {iConfigParams} from '../../AppService';
import iSynCommunitySkill from '../../../types/Synergetic/Community/iSynCommunitySkill';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = '/syn/communitySkill';

const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynCommunitySkill>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const updateSkillExpiryDate = (staffId: number, skillCode: string, expiryDate: string): Promise<iSynCommunitySkill> => {
  return AppService.put(`${endPoint}/${staffId}/${skillCode}`, {ExpiryDate: expiryDate}).then(resp => resp.data);
};

const bulkUpdateSkillExpiryDate = (staffIds: number[], skillCode: string, expiryDate: string): Promise<PromiseSettledResult<iSynCommunitySkill>[]> => {
  return Promise.allSettled(staffIds.map(staffId => updateSkillExpiryDate(staffId, skillCode, expiryDate)));
};

const SynCommunitySkillService = {
  getAll,
  updateSkillExpiryDate,
  bulkUpdateSkillExpiryDate,
}

export default SynCommunitySkillService;
