import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardStudentYearService from '../../../services/HouseAwards/HouseAwardStudentYearService';

describe('HouseAwardStudentYearService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStudentYears',
    serviceFn: HouseAwardStudentYearService.getStudentYears,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/studentYear"),
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentYear',
    serviceFn: HouseAwardStudentYearService.getStudentYear,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/studentYear"),
  });
  ServiceTestHelper.testCustom({
    name: 'createStudentYear',
    serviceFn: HouseAwardStudentYearService.createStudentYear,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/studentYear"),
  });
  ServiceTestHelper.testCustom({
    name: 'updateStudentYear',
    serviceFn: HouseAwardStudentYearService.updateStudentYear,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/studentYear"),
  });
  ServiceTestHelper.testCustom({
    name: 'deleteStudentYear',
    serviceFn: HouseAwardStudentYearService.deleteStudentYear,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/studentYear"),
  });
});
