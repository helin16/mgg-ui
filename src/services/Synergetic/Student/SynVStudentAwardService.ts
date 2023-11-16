import AppService, {iConfigParams} from '../../AppService';
import IPaginatedResult from '../../../types/iPaginatedResult';
import iStudentReportAward from '../../../types/Synergetic/Student/iStudentReportAward';



const endPoint = '/syn/vStudentAward';
const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<IPaginatedResult<iStudentReportAward>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVStudentAwardService = {
  getAll,
}

export default SynVStudentAwardService;
