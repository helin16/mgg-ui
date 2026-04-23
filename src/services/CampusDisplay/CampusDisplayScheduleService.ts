import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iCampusDisplaySchedule from '../../types/CampusDisplay/iCampusDisplaySchedule';

const endPoint = '/campusDisplaySchedule';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCampusDisplaySchedule>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySchedule> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySchedule> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySchedule> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CampusDisplayService = {
  getAll,
  create,
  update,
  deactivate,
}

export default CampusDisplayService;
