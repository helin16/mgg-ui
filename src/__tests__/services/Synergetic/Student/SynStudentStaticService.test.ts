import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentStaticService from '../../../../services/Synergetic/Student/SynStudentStaticService';

describe('SynStudentStaticService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynStudentStaticService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/studentStatic"),
  });
});
