import AppService, {iConfigParams} from '../AppService';

const endPoint = `/syn/timeTable`;
const importTimeTable = (data: iConfigParams = {}, config?: iConfigParams) => {
  return AppService.post(`${endPoint}/import`, data, config).then(resp => resp.data);
};

const SynTimeTableService = {
  importTimeTable
}

export default SynTimeTableService;
