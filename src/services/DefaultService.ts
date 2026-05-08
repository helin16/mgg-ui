import AppService, {iConfigParams} from './AppService';

const endPoint = '/';

const getRoot = (params: iConfigParams = {}, config?: iConfigParams): Promise<any> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const DefaultService = {
  getRoot,
};

export default DefaultService;
