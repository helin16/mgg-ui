import AppService, {iConfigParams} from '../../AppService';
import iSynGeneralLedgerUser from '../../../types/Synergetic/Finance/iSynGeneralLedgerUser';

const endPoint = '/syn/generalLedgerUser';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynGeneralLedgerUser[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynGeneralLedgerUserService = {
  getAll,
};

export default SynGeneralLedgerUserService;
