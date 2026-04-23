import AppService, {iConfigParams} from '../AppService';

const endPoint = `/syn/timeTable`;
const importTimeTable = (data: iConfigParams = {}, config?: iConfigParams) => {
  return AppService.post(`${endPoint}/import`, data, config).then(resp => resp.data);
};
const getStudentSubjects = (studentSynId: string | number, data: iConfigParams = {}, config?: iConfigParams) => {
  return AppService.get(`${endPoint}/studentSubjects/${studentSynId}`, data, config).then(resp => resp.data);
};

const SynTimeTableService = {
  importTimeTable,
  getStudentSubjects,
}

export default SynTimeTableService;
