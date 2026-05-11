import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStaffJobPositionService from '../../../../services/Synergetic/Staff/SynStaffJobPositionService';

describe('SynStaffJobPositionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynStaffJobPositionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/staffJobPosition"),
  });
});
