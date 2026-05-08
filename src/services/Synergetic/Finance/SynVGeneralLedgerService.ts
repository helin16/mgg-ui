import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVGeneralLedger from '../../../types/Synergetic/Finance/iSynVGeneralLedger';

const endPoint = '/syn/vGeneralLedger';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynVGeneralLedger>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVGeneralLedgerService = {
  getAll,
};

export default SynVGeneralLedgerService;
