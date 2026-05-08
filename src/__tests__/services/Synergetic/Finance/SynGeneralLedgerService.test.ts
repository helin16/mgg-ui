import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerService from '../../../../services/Synergetic/Finance/SynGeneralLedgerService';

describe('SynGeneralLedgerService', () => {
  const endPoint = '/syn/generalLedger';

  ServiceTestHelper.testGetAll(endPoint, SynGeneralLedgerService.getAll);
});
