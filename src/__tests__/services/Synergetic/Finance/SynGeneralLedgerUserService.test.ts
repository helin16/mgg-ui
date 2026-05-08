import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerUserService from '../../../../services/Synergetic/Finance/SynGeneralLedgerUserService';

describe('SynGeneralLedgerUserService', () => {
  const endPoint = '/syn/generalLedgerUser';

  ServiceTestHelper.testGetAll(endPoint, SynGeneralLedgerUserService.getAll);
});
