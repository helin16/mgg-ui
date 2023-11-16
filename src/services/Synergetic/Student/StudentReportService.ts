import AppService, {iConfigParams} from '../../AppService';
import iStudentReportYear from '../../../types/Synergetic/Student/iStudentReportYear';
import iStudentReportResult from '../../../types/Synergetic/Student/iStudentReportResult';
import iStudentReportComparativeResultMap from '../../../types/Synergetic/Student/iStudentReportComparativeResult';
import iStudentReportCoCurricular from '../../../types/Synergetic/Student/iStudentReportCoCurricular';
import iStudentReportAward from '../../../types/Synergetic/Student/iStudentReportAward';
import iAsset from '../../../types/asset/iAsset';
import {iPowerBiReportMap} from '../../../types/student/iPowerBIReports';
import iStudentReportStyle from '../../../types/Synergetic/Student/iStudentReportStyle';
import iPaginatedResult from '../../../types/iPaginatedResult';

const baseEndPoint = '/studentReport';
const getStudentReportYears = (params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(baseEndPoint, params).then(resp => resp.data);
};
const getStudentReportStyles = (params: iConfigParams = {}): Promise<iStudentReportStyle[]> => {
  return AppService.get(`${baseEndPoint}/styles`, params).then(resp => resp.data);
};
const deleteStudentReportYear = (id: string | number, params: iConfigParams = {}): Promise<iStudentReportYear> => {
  return AppService.delete(`${baseEndPoint}/${id}`, params).then(resp => resp.data);
};
const createStudentReportYear = (params: iConfigParams = {}): Promise<iStudentReportYear> => {
  return AppService.post(baseEndPoint, params).then(resp => resp.data);
};
const updateStudentReportYear = (id: string | number, params: iConfigParams = {}): Promise<iStudentReportYear> => {
  return AppService.put(`${baseEndPoint}/${id}`, params).then(resp => resp.data);
};

const getStudentReportYearsForAStudent = (studentId: string | number, params: iConfigParams = {}): Promise<iStudentReportYear[]> => {
  return AppService.get(`${baseEndPoint}/reportedYears/${studentId}`, params).then(resp => resp.data);
};

const getStudentReportResultForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportResult[]> => {
  return AppService.get(`${baseEndPoint}/result/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportResults = (params: iConfigParams = {}): Promise<iPaginatedResult<iStudentReportResult>> => {
  return AppService.get(`${baseEndPoint}/result`, params).then(resp => resp.data);
};

const getStudentReportComparativeResultForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportComparativeResultMap> => {
  return AppService.get(`${baseEndPoint}/comparative/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportCoCurricularForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportCoCurricular[]> => {
  return AppService.get(`${baseEndPoint}/cocurricular/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportAwardsForAStudent = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iStudentReportAward[]> => {
  return AppService.get(`${baseEndPoint}/award/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getStudentReportDownloadPDF = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iAsset> => {
  return AppService.post(`${baseEndPoint}/download/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const emailStudentReportPDF = (studentId: string | number, reportYearId: string | number, params: iConfigParams = {}): Promise<iAsset> => {
  return AppService.post(`${baseEndPoint}/email/${studentId}/${reportYearId}`, params).then(resp => resp.data);
};

const getPowerBIReports = (studentId: string | number, params: iConfigParams = {}): Promise<iPowerBiReportMap> => {
  return AppService.get(`${baseEndPoint}/getPowerBIReportIds/${studentId}`, params).then(resp => resp.data);
};

const genComparativeResults = (params: iConfigParams): Promise<{ success: boolean}> => {
  return AppService.post(`${baseEndPoint}/comparative`, params).then(resp => resp.data);
}

const StudentReportService = {
  getStudentReportStyles,
  getStudentReportYears,
  createStudentReportYear,
  updateStudentReportYear,
  deleteStudentReportYear,
  getStudentReportYearsForAStudent,
  getStudentReportResultForAStudent,
  getStudentReportResults,
  getStudentReportComparativeResultForAStudent,
  getStudentReportCoCurricularForAStudent,
  getStudentReportAwardsForAStudent,
  getStudentReportDownloadPDF,
  emailStudentReportPDF,
  getPowerBIReports,
  genComparativeResults,
}

export default StudentReportService;
