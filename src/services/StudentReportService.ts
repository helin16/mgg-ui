import AppService, {iConfigParams} from './AppService';
import iStudentReportYear from '../types/student/iStudentReportYear';
import iStudentReportResult from '../types/student/iStudentReportResult';
import iStudentReportComparativeResult from '../types/student/iStudentReportComparativeResult';
import iStudentReportComparativeResultMap from '../types/student/iStudentReportComparativeResult';

const getStudentReportYears = (params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(`/studentReport`, params).then(resp => resp.data);
};

const getStudentReportYearsForAStudent = (studentId: string, params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(`/studentReport/reportedYears/${studentId}`, params).then(resp => resp.data);
};

const getStudentReportResultForAStudent = (studentId: string, reportYearId: string, params: iConfigParams = {}): Promise<iStudentReportResult[]> => {
  return AppService.get(`/studentReport/result/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportComparativeResultForAStudent = (studentId: string, reportYearId: string, params: iConfigParams = {}): Promise<iStudentReportComparativeResultMap> => {
  return AppService.get(`/studentReport/comparative/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const StudentReportService = {
  getStudentReportYears,
  getStudentReportYearsForAStudent,
  getStudentReportResultForAStudent,
  getStudentReportComparativeResultForAStudent,
}

export default StudentReportService;
