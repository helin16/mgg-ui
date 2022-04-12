import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSBSubmissionGrade from '../../types/SchoolBox/iSBSubmissionGrade';

const endPoint = `/sb/submissionGrade`;

const getSubmissionGrades = (params: iConfigParams = {}): Promise<iPaginatedResult<iSBSubmissionGrade>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SBSubmissionGradeService = {
  getSubmissionGrades
}

export default SBSubmissionGradeService;
