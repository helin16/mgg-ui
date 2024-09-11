import AppService, {iConfigParams} from '../AppService';
import iCampusDisplaySlide from '../../types/CampusDisplay/iCampusDisplaySlide';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/campusDisplaySlide';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCampusDisplaySlide>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const createFromFolder = (folderId: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide[]> => {
  return AppService.post(`${endPoint}/folder/${folderId}`, params, config).then(resp => resp.data);
}

const upload = (displayId: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.post(`${endPoint}/upload/${displayId}`, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCampusDisplaySlide> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CampusDisplaySlideService = {
  createFromFolder,
  getAll,
  create,
  update,
  upload,
  deactivate,
}

export default CampusDisplaySlideService;
