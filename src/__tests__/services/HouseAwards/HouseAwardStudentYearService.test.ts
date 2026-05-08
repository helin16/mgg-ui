import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardStudentYearService from '../../../services/HouseAwards/HouseAwardStudentYearService';

describe('HouseAwardStudentYearService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStudentYears',
    serviceFn: HouseAwardStudentYearService.getStudentYears,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/studentYear", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentYear',
    serviceFn: HouseAwardStudentYearService.getStudentYear,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/studentYear/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'createStudentYear',
    serviceFn: HouseAwardStudentYearService.createStudentYear,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/studentYear", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateStudentYear',
    serviceFn: HouseAwardStudentYearService.updateStudentYear,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/studentYear/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteStudentYear',
    serviceFn: HouseAwardStudentYearService.deleteStudentYear,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/studentYear/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
