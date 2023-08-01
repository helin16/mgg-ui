import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynVMedicalIncidentsAll from '../../types/Synergetic/Medical/iSynVMedicalIncidentsAll';

const endPoint = '/syn/vMedicalIncidentsAll';

const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVMedicalIncidentsAll>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVMedicalIncidentsAllService = {
  getAll,
}

export default SynVMedicalIncidentsAllService;
