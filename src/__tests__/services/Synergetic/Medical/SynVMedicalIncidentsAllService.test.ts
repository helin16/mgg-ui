import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalIncidentsAllService from '../../../../services/Synergetic/Medical/SynVMedicalIncidentsAllService';

describe('SynVMedicalIncidentsAllService', () => {
  const endPoint = '/syn/vMedicalIncidentsAll';

  ServiceTestHelper.testGetAll(endPoint, SynVMedicalIncidentsAllService.getAll);
});
