import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAbsenceTypeService from '../../../../services/Synergetic/Lookup/SynLuAbsenceTypeService';

describe('SynLuAbsenceTypeService', () => {
  const endPoint = '/syn/luAbsenceType/';

  ServiceTestHelper.testGetAll(endPoint, SynLuAbsenceTypeService.getAll);
});
