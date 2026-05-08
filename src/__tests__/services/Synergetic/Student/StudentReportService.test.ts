import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import StudentReportService from '../../../../services/Synergetic/Student/StudentReportService';

describe('StudentReportService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStudentReportStyles',
    serviceFn: StudentReportService.getStudentReportStyles,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/studentReport/styles", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportYears',
    serviceFn: StudentReportService.getStudentReportYears,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/studentReport", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'createStudentReportYear',
    serviceFn: StudentReportService.createStudentReportYear,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/studentReport", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateStudentReportYear',
    serviceFn: StudentReportService.updateStudentReportYear,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteStudentReportYear',
    serviceFn: StudentReportService.deleteStudentReportYear,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportYearsForAStudent',
    serviceFn: StudentReportService.getStudentReportYearsForAStudent,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/reportedYears/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportResultForAStudent',
    serviceFn: StudentReportService.getStudentReportResultForAStudent,
    appMethod: 'get',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/result/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportResults',
    serviceFn: StudentReportService.getStudentReportResults,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/studentReport/result", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportComparativeResultForAStudent',
    serviceFn: StudentReportService.getStudentReportComparativeResultForAStudent,
    appMethod: 'get',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/comparative/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportCoCurricularForAStudent',
    serviceFn: StudentReportService.getStudentReportCoCurricularForAStudent,
    appMethod: 'get',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/cocurricular/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportAwardsForAStudent',
    serviceFn: StudentReportService.getStudentReportAwardsForAStudent,
    appMethod: 'get',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/award/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentReportDownloadPDF',
    serviceFn: StudentReportService.getStudentReportDownloadPDF,
    appMethod: 'post',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/download/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'emailStudentReportPDF',
    serviceFn: StudentReportService.emailStudentReportPDF,
    appMethod: 'post',
    callArgs: ["123", "123", {"fakeParams":"value"}],
    expectedArgs: ["/studentReport/email/123/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'genComparativeResults',
    serviceFn: StudentReportService.genComparativeResults,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/studentReport/comparative", {"fakeParams":"value"}],
  });
});
