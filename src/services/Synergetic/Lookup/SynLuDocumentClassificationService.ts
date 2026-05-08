import AppService, {iConfigParams} from '../../AppService';
import iSynLuDocumentClassification from '../../../types/Synergetic/Lookup/iSynLuDocumentClassification';

const endPoint = '/syn/luDocumentClassification';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynLuDocumentClassification[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynLuDocumentClassificationService = {
  getAll,
};

export default SynLuDocumentClassificationService;
