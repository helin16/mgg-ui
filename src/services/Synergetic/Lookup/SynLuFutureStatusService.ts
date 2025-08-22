import AppService, {iConfigParams} from '../../AppService';
import iSynLuFutureStatus from '../../../types/Synergetic/Lookup/iSynLuFutureStatus';

const getAll = (params: iConfigParams = {}): Promise<iSynLuFutureStatus[]> => {
  return AppService.get(`/syn/luFutureStatus`, params).then(resp => resp.data);
};

const SynLuFutureStatusService = {
  getAll
}

export default SynLuFutureStatusService;
