import AppService, {iConfigParams} from '../AppService';
import iSynVDocument from '../../types/Synergetic/iSynVDocument';
import iPaginatedResult from '../../types/iPaginatedResult';

const getVDocuments = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDocument>> => {
  return AppService.get(`/syn/vDocument`, params).then(resp => resp.data);
};

const SynVDocumentService = {
  getVDocuments,
}

export default SynVDocumentService;
