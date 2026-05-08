import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerJournalService from '../../../../services/Synergetic/Finance/SynGeneralLedgerJournalService';

describe('SynGeneralLedgerJournalService', () => {
  const endPoint = '/syn/generalLedgerJournal';

  ServiceTestHelper.testGetAll(endPoint, SynGeneralLedgerJournalService.getAll);
});
