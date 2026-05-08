import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynMedicalDetails from '../../../types/Synergetic/Medical/iSynMedicalDetails';

const endPoint = '/syn/medicalDetails';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynMedicalDetails>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynMedicalDetailsService = {
  getAll,
};

export default SynMedicalDetailsService;
