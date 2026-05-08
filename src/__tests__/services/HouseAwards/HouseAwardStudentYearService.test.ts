import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardStudentYearService from '../../../services/HouseAwards/HouseAwardStudentYearService';

describe('HouseAwardStudentYearService', () => {
  const endPoint = '/houseAwards/studentYear';

  ServiceTestHelper.testGetAll(endPoint, HouseAwardStudentYearService.getStudentYears);
  ServiceTestHelper.testGet(endPoint, HouseAwardStudentYearService.getStudentYear);
  ServiceTestHelper.testCreate(endPoint, HouseAwardStudentYearService.createStudentYear);
  ServiceTestHelper.testUpdate(endPoint, HouseAwardStudentYearService.updateStudentYear);
  ServiceTestHelper.testDeactivate(endPoint, HouseAwardStudentYearService.deleteStudentYear);
});
