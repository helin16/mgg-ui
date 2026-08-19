import AppService, {iConfigParams} from '../AppService';
import {iStaffSkillExpirationLogsResult} from '../../types/StaffSkillExpiration/iStaffSkillExpirationLog';

const endPoint = '/staffSkillExpiration';

const getLogs = (params: iConfigParams = {}): Promise<iStaffSkillExpirationLogsResult> => {
  return AppService.get(`${endPoint}/logs`, params).then(resp => resp.data);
};

const StaffSkillExpirationService = {
  getLogs,
};

export default StaffSkillExpirationService;
