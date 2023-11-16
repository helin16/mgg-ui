import AppService, {iConfigParams} from '../../AppService';
import IPaginatedResult from '../../../types/iPaginatedResult';
import iStudentReportCoCurricular from '../../../types/Synergetic/Student/iStudentReportCoCurricular';



const endPoint = '/syn/vStudentCoCurricular';
const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<IPaginatedResult<iStudentReportCoCurricular>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVStudentCoCurricularService = {
  getAll,
}

export default SynVStudentCoCurricularService;
