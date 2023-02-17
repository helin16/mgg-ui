import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynGeneralLedgerJournal from '../../../types/Synergetic/Finance/iSynGeneralLedagerJournal';


const endPoint = '/syn/generalLedgerJournal'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynGeneralLedgerJournal>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynGeneralLedgerJournalService = {
  getAll,
};

export default SynGeneralLedgerJournalService;
