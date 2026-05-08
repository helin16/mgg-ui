import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAbsenceService from '../../../../services/Synergetic/Absence/SynVAbsenceService';

describe('SynVAbsenceService', () => {
  const endPoint = '/syn/vAbsence';

  ServiceTestHelper.testGetAll(endPoint, SynVAbsenceService.getAll);
});
