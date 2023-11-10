import AppService, {iConfigParams} from '../../AppService';
import iSynLuCourtOrderType from '../../../types/Synergetic/Lookup/iSynLuCourtOrderType';

const endPoint = '/syn/luCourtOrderType';

const getAll = (params: iConfigParams = {}): Promise<iSynLuCourtOrderType[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuCourtOrderTypeService = {
  getAll
}

export default SynLuCourtOrderTypeService;
