import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVGeneralLedgerService from '../../../../services/Synergetic/Finance/SynVGeneralLedgerService';

describe('SynVGeneralLedgerService', () => {
  const endPoint = '/syn/vGeneralLedger';

  ServiceTestHelper.testGetAll(endPoint, SynVGeneralLedgerService.getAll);
});
