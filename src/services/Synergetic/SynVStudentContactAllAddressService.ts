import AppService, {iConfigParams} from '../AppService';
import iStudentContact from '../../types/Synergetic/iStudentContact';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynVStudentContactAllAddress from '../../types/Synergetic/iSynVStudentContactAllAddress';

const endPoint = `/syn/vStudentContactAllAddress`;

const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVStudentContactAllAddress>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVStudentContactAllAddressService = {
  getAll
}

export default SynVStudentContactAllAddressService;
