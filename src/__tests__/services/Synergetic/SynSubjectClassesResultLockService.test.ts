import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynSubjectClassesResultLockService from '../../../services/Synergetic/SynSubjectClassesResultLockService';

describe('SynSubjectClassesResultLockService', () => {
  const endPoint = '/syn/subjectClassesResultLock';

  ServiceTestHelper.testGetAll(endPoint, SynSubjectClassesResultLockService.getAll);
  ServiceTestHelper.testCustom({
    name: 'deleteLock',
    serviceFn: SynSubjectClassesResultLockService.deleteLock,
    appMethod: 'delete',
    callArgs: ['123', {fakeParams: 'value'}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}],
  });
});
