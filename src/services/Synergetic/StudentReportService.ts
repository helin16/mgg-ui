import AppService, {iConfigParams} from '../AppService';
import iStudentReportYear from '../../types/Synergetic/iStudentReportYear';
import iStudentReportResult from '../../types/Synergetic/iStudentReportResult';
import iStudentReportComparativeResultMap from '../../types/Synergetic/iStudentReportComparativeResult';
import iStudentReportCoCurricular from '../../types/Synergetic/iStudentReportCoCurricular';
import iStudentReportAward from '../../types/Synergetic/iStudentReportAward';
import iAsset from '../../types/asset/iAsset';
import {iPowerBiReportMap} from '../../types/student/iPowerBIReports';
import iStudentReportStyle from '../../types/Synergetic/iStudentReportStyle';

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

const StudentReportService = {
  getStudentReportStyles,
  getStudentReportYears,
  createStudentReportYear,
  updateStudentReportYear,
  deleteStudentReportYear,
  getStudentReportYearsForAStudent,
  getStudentReportResultForAStudent,
  getStudentReportComparativeResultForAStudent,
  getStudentReportCoCurricularForAStudent,
  getStudentReportAwardsForAStudent,
  getStudentReportDownloadPDF,
  emailStudentReportPDF,
  getPowerBIReports,
}

export default StudentReportService;
