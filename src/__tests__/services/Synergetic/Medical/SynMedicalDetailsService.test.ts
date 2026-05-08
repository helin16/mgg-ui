import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynMedicalDetailsService from '../../../../services/Synergetic/Medical/SynMedicalDetailsService';

describe('SynMedicalDetailsService', () => {
  const endPoint = '/syn/medicalDetails';

  ServiceTestHelper.testGetAll(endPoint, SynMedicalDetailsService.getAll);
});
