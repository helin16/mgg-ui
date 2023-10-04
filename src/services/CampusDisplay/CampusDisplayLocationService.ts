import AppService, {iConfigParams} from '../AppService';
import iCampusDisplayLocation from '../../types/CampusDisplay/iCampusDisplayLocation';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/campusDisplayLocation';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCampusDisplayLocation>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplayLocation> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplayLocation> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCampusDisplayLocation> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CampusDisplaySlideService = {
  getAll,
  create,
  update,
  deactivate,
}

export default CampusDisplaySlideService;
