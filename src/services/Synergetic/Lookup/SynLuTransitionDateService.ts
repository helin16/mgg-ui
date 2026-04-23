import AppService, {iConfigParams} from '../../AppService';
import iSynLuTransitionDate from '../../../types/Synergetic/Lookup/iSynLuTransitionDate';

const endPoint = '/syn/luTransitionDate';

const getAll = (params: iConfigParams = {}): Promise<iSynLuTransitionDate[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};
const getById = (fileYear: number, params: iConfigParams = {}): Promise<iSynLuTransitionDate> => {
  return AppService.get(`${endPoint}/${fileYear}`, params).then(resp => resp.data);
};
const create = (data: iConfigParams, params: iConfigParams = {}): Promise<iSynLuTransitionDate> => {
  return AppService.post(endPoint, data, params).then(resp => resp.data);
};
const updateById = (fileYear: number, params: iConfigParams = {}): Promise<iSynLuTransitionDate> => {
  return AppService.put(`${endPoint}/${fileYear}`, params).then(resp => resp.data);
};


const SynLuTransitionDateService = {
  getAll,
  getById,
  create,
  updateById,
}

export default SynLuTransitionDateService;
