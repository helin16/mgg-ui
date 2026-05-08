import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactAllAddressService from '../../../../services/Synergetic/Student/SynVStudentContactAllAddressService';

describe('SynVStudentContactAllAddressService', () => {
  const endPoint = '/syn/vStudentContactAllAddress';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentContactAllAddressService.getAll);
});
