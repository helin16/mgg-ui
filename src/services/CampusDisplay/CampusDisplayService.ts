import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iCampusDisplay from '../../types/CampusDisplay/iCampusDisplay';

const endPoint = '/campusDisplay';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCampusDisplay>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplay> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplay> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCampusDisplay> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CampusDisplayService = {
  getAll,
  create,
  update,
  deactivate,
}

export default CampusDisplayService;
