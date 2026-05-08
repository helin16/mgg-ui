import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerJournalService from '../../../../services/Synergetic/Finance/SynGeneralLedgerJournalService';

describe('SynGeneralLedgerJournalService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerJournalService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/generalLedgerJournal", {"fakeParams":"value"}],
  });
});
