import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import TestHelper from '../../../helper/TestHelper';
import StudentReportService from '../../../../services/Synergetic/Student/StudentReportService';

describe('StudentReportService', () => {
  const {fakeId, fakeParams} = TestHelper.getFakeParams();
  const fakeReportedYearId = TestHelper.faker.string.uuid();

  ServiceTestHelper.testCustom({
    name: 'getStudentReportStyles',
    serviceFn: StudentReportService.getStudentReportStyles,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/studentReport/styles"),
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportYears',
    serviceFn: StudentReportService.getStudentReportYears,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/studentReport"),
  });
  ServiceTestHelper.testCustom({
    name: 'createStudentReportYear',
    serviceFn: StudentReportService.createStudentReportYear,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/studentReport"),
  });
  ServiceTestHelper.testCustom({
    name: 'updateStudentReportYear',
    serviceFn: StudentReportService.updateStudentReportYear,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithId('/studentReport'),
  });
  ServiceTestHelper.testCustom({
    name: 'deleteStudentReportYear',
    serviceFn: StudentReportService.deleteStudentReportYear,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithId('/studentReport'),
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportYearsForAStudent',
    serviceFn: StudentReportService.getStudentReportYearsForAStudent,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: [`/studentReport/reportedYears/${fakeId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportResultForAStudent',
    serviceFn: StudentReportService.getStudentReportResultForAStudent,
    appMethod: 'get',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/result/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportResults',
    serviceFn: StudentReportService.getStudentReportResults,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/studentReport/result"),
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportComparativeResultForAStudent',
    serviceFn: StudentReportService.getStudentReportComparativeResultForAStudent,
    appMethod: 'get',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/comparative/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportCoCurricularForAStudent',
    serviceFn: StudentReportService.getStudentReportCoCurricularForAStudent,
    appMethod: 'get',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/cocurricular/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportAwardsForAStudent',
    serviceFn: StudentReportService.getStudentReportAwardsForAStudent,
    appMethod: 'get',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/award/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportDownloadPDF',
    serviceFn: StudentReportService.getStudentReportDownloadPDF,
    appMethod: 'post',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/download/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'emailStudentReportPDF',
    serviceFn: StudentReportService.emailStudentReportPDF,
    appMethod: 'post',
    callArgs: [fakeId, fakeReportedYearId, fakeParams],
    expectedArgs: [`/studentReport/email/${fakeId}/${fakeReportedYearId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'genComparativeResults',
    serviceFn: StudentReportService.genComparativeResults,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/studentReport/comparative"),
  });
});
