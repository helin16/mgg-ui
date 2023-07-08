import AppService, {iConfigParams} from '../AppService';
import iSynFileSemester from '../../types/Synergetic/iSynFileSemester';
import {iStartAndEndDateString} from '../../pages/dataSubmissions/components/SchoolCensusData/iSchoolCensusStudentData';
import {OP_GTE, OP_LTE} from '../../helper/ServiceHelper';

const endPoint = `/syn/fileSemester`;
const getFileSemesters = (params: iConfigParams = {}, options?: iConfigParams): Promise<iSynFileSemester[]> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

export type iSchoolDay = {
  date: string;
  isSchoolDay: boolean;
  isInAttMaster: boolean;
  isWeekEnd: boolean;
  isInStuFreeCalEvt: boolean;
  isNotInFileSemester: boolean;
  comments: string;
};
const getSchoolDays = (params: iConfigParams = {}, options?: iConfigParams): Promise<string[]> => {
  return AppService.get(`${endPoint}/schoolDays`, params, options).then(resp => resp.data);
};
const getSchoolDaysAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iSchoolDay[]> => {
  return AppService.get(`${endPoint}/schoolDays`, {...params, showAll: true}, options).then(resp => resp.data);
};

const getFileSemesterFromStartAndEndDate = async ({ startDateStr,  endDateStr, }:iStartAndEndDateString  ): Promise<{
  startDateFileSemesters: iSynFileSemester[],
  endDateFileSemesters: iSynFileSemester[],
}> => {
  const [startDateFileSemesters, endDateFileSemesters] = await Promise.all([
    SynFileSemesterService.getFileSemesters({
      where: JSON.stringify({
        ActivatedFlag: true,
        StartDate: {[OP_LTE]: startDateStr},
        EndDate: {[OP_GTE]: startDateStr},
      }),
      perPage: 1,
      currentPage: 1,
    }),
    SynFileSemesterService.getFileSemesters({
      where: JSON.stringify({
        ActivatedFlag: true,
        StartDate: {[OP_LTE]: endDateStr},
        EndDate: {[OP_GTE]: endDateStr},
      }),
      perPage: 1,
      currentPage: 1,
    }),
  ]);

  return {
    // @ts-ignore
    startDateFileSemesters: startDateFileSemesters.data || [],
    // @ts-ignore
    endDateFileSemesters: endDateFileSemesters.data || [],
  }
}

const SynFileSemesterService = {
  getSchoolDays,
  getSchoolDaysAll,
  getFileSemesters,
  getFileSemesterFromStartAndEndDate,
}

export default SynFileSemesterService;
