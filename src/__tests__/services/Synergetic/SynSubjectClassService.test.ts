import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynSubjectClassService from '../../../services/Synergetic/SynSubjectClassService';

describe('SynSubjectClassService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynSubjectClassService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/subjectClass"),
  });
});
