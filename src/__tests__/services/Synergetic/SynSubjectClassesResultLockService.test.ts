import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynSubjectClassesResultLockService from '../../../services/Synergetic/SynSubjectClassesResultLockService';

describe('SynSubjectClassesResultLockService', () => {
  const endPoint = '/syn/subjectClassesResultLock';

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynSubjectClassesResultLockService.getAll,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}],
    expectedArgs: [endPoint, {fakeParams: 'value'}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteLock',
    serviceFn: SynSubjectClassesResultLockService.deleteLock,
    appMethod: 'delete',
    callArgs: ['123', {fakeParams: 'value'}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}],
  });
});
