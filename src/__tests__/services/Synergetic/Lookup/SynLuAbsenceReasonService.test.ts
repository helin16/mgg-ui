import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAbsenceReasonService from '../../../../services/Synergetic/Lookup/SynLuAbsenceReasonService';

describe('SynLuAbsenceReasonService', () => {
  const endPoint = '/syn/luAbsenceReason/';

  ServiceTestHelper.testGetAll(endPoint, SynLuAbsenceReasonService.getAll);
});
