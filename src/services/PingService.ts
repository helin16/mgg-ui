import AppService, {iConfigParams} from './AppService';

const endPoint = `/ping`;

const ping = (params: iConfigParams = {}): Promise<{ data: string; isProd: boolean }> => {
  return AppService.get(`${endPoint}`, params).then(resp => resp.data);
};


const PingService = {
  ping,
}

export default PingService;
