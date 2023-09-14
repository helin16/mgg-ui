import AppService, {iConfigParams} from '../AppService';
import iCampusDisplaySlide from '../../types/CampusDisplay/iCampusDisplaySlide';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/campusDisplaySlide';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCampusDisplaySlide>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const create = (displayId: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.post(`${endPoint}/${displayId}`, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CampusDisplaySlideService = {
  getAll,
  create,
  update,
  deactivate,
}

export default CampusDisplaySlideService;
