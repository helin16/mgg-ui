import ServiceTestHelper from '../../helper/ServiceTestHelper';
import StaffSkillExpirationService from '../../../services/StaffSkillExpiration/StaffSkillExpirationService';

describe('StaffSkillExpirationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getLogs',
    serviceFn: StaffSkillExpirationService.getLogs,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs('/staffSkillExpiration/logs'),
  });
});
