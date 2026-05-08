import ServiceTestHelper from '../../helper/ServiceTestHelper';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import {
  STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT,
  STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN,
} from '../../../types/StudentAbsence/iStudentAbsence';

describe('StudentAbsenceService', () => {
  const endPoint = '/studentAbsence';

  ServiceTestHelper.testGetAll(endPoint, StudentAbsenceService.getAll);
  ServiceTestHelper.testGet(endPoint, StudentAbsenceService.get);
  ServiceTestHelper.testCreate(endPoint, StudentAbsenceService.create);
  ServiceTestHelper.testUpdate(endPoint, StudentAbsenceService.update);
  ServiceTestHelper.testDeactivate(endPoint, StudentAbsenceService.remove);

  ServiceTestHelper.testCustom({
    name: 'submitByParent',
    serviceFn: StudentAbsenceService.submitByParent,
    appMethod: 'post',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/parentSubmission`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });

  ServiceTestHelper.testCustom({
    name: 'syncToSynergetic',
    serviceFn: StudentAbsenceService.syncToSynergetic,
    appMethod: 'put',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123/syncToSynergetic`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });

  describe('getAbsenceTypeName', () => {
    test('maps record types to labels', () => {
      expect(StudentAbsenceService.getAbsenceTypeName(STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT)).toBe('Early Sign-outs');
      expect(StudentAbsenceService.getAbsenceTypeName(STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN)).toBe('Late Sign-ins');
      expect(StudentAbsenceService.getAbsenceTypeName('OTHER' as any)).toBe('unknow');
    });
  });
});
