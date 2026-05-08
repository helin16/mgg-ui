import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuImmunisationFormStatusService from '../../../../services/Synergetic/Lookup/SynLuImmunisationFormStatusService';

describe('SynLuImmunisationFormStatusService', () => {
  const endPoint = '/syn/luImmunisationFormStatus';

  ServiceTestHelper.testGetAll(endPoint, SynLuImmunisationFormStatusService.getAll);
});
