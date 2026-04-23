import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynVActivity from '../../types/Synergetic/iSynVActivity';

const endPoint = `/syn/vActivity`;

const getAllById = (synId: number | string, params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynVActivity>> => {
  return AppService.get(`${endPoint}/${synId}`, params, config).then(resp => resp.data);
}

const SynVActivityService = {
  getAllById,
}

export default SynVActivityService;
