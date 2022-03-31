import AppService, {iConfigParams} from './AppService';
import iStudentReportYear from '../types/student/iStudentReportYear';
import iStudentReportResult from '../types/student/iStudentReportResult';
import iStudentReportComparativeResultMap from '../types/student/iStudentReportComparativeResult';
import iStudentReportCoCurricular from '../types/student/iStudentReportCoCurricular';
import iStudentReportAward from '../types/student/iStudentReportAward';

const getStudentReportYears = (params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(`/studentReport`, params).then(resp => resp.data);
};

const getStudentReportYearsForAStudent = (studentId: string | number, params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(`/studentReport/reportedYears/${studentId}`, params).then(resp => resp.data);
};

const getStudentReportResultForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportResult[]> => {
  return AppService.get(`/studentReport/result/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportComparativeResultForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportComparativeResultMap> => {
  return AppService.get(`/studentReport/comparative/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportCoCurricularForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportCoCurricular[]> => {
  return AppService.get(`/studentReport/cocurricular/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportAwardsForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportAward[]> => {
  return AppService.get(`/studentReport/award/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const StudentReportService = {
  getStudentReportYears,
  getStudentReportYearsForAStudent,
  getStudentReportResultForAStudent,
  getStudentReportComparativeResultForAStudent,
  getStudentReportCoCurricularForAStudent,
  getStudentReportAwardsForAStudent,
}

export default StudentReportService;
