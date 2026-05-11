import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynPastStudentService from '../../../services/Synergetic/SynPastStudentService';

describe('SynPastStudentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynPastStudentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/pastStudent"),
  });
});
