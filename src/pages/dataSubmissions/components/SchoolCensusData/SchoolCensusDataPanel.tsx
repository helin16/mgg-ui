import styled from 'styled-components';
import {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import Toaster, {TOAST_TYPE_ERROR} from '../../../../services/Toaster';
import SynFileSemesterService from '../../../../services/Synergetic/SynFileSemesterService';
import {OP_AND, OP_GTE, OP_LIKE, OP_LTE, OP_OR} from '../../../../helper/ServiceHelper';
import * as _ from 'lodash';
import SynVStudentService from '../../../../services/Synergetic/SynVStudentService';
import iSynFileSemester from '../../../../types/Synergetic/iSynFileSemester';
import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusTable from './SchoolCensusTable';
import SectionDiv from '../../../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import SynVtudentDisabilityAdjustmentService
  from '../../../../services/Synergetic/SynVStudentDisabilityAdjustmentService';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import iLuYearLevel from '../../../../types/Synergetic/iLuYearLevel';
import SynLuYearLevelService from '../../../../services/Synergetic/SynLuYearLevelService';
import SchoolCensusDataSummaryDiv from './SchoolCensusDataSummaryDiv';
import {
  DISABILITY_ADJUSTMENT_LEVEL_CODES_FOR_CENSUS_REPORT
} from '../../../../types/Synergetic/iSynVStudentDisabilityAdjustment';
import SchoolCensusDataSearchPanel, {iSchoolCensusDataSearchCriteria} from './SchoolCensusDataSearchPanel';
import UtilsService from '../../../../services/UtilsService';
import SynCalendarEventService from '../../../../services/Synergetic/TimeTable/SynCalendarEventService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../../services/AppService';

const Wrapper = styled.div``;

const SchoolCensusDataPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [studentRecords, setStudentRecords] = useState<iSchoolCensusStudentData[] | null>(null);
  const [unfilteredStudentRecords, setUnfilteredStudentRecords] = useState<iSchoolCensusStudentData[] | null>(null);
  const [schoolDays, setSchoolDays] = useState<string[]>([]);
  const [yearLevels, setYearLevels] = useState<iLuYearLevel[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<iSchoolCensusDataSearchCriteria | null>(null);


  useEffect(() => {
    if (searchCriteria === null) return;
    let isCanceled = false;
    const getFileSemesters = ({ startDateStr,  endDateStr, }:iStartAndEndDateString  ) => {
      return SynFileSemesterService.getFileSemesters({
        where: JSON.stringify({
          ActivatedFlag: true,
          StartDate: {[OP_LTE]: startDateStr},
          EndDate: {[OP_GTE]: endDateStr},
        })
      });
    }

    const getAgeFromBirthDate = (birthDateString: string, { endDateStr, }:iStartAndEndDateString) => {
      const birthStr = `${birthDateString || ''}`.trim();
      if (birthStr === '') {
        return '';
      }
      const age = Math.floor(moment(`${endDateStr}`).diff(birthDateString, 'month') / 12);
      if (age <= 1) {
        return '1';
      }
      if (age > 21) {
        return '21+';
      }
      return `${age}`;
    }

    const getStudents = async (fileSemesters: iSynFileSemester[], startAndEndDateString :iStartAndEndDateString): Promise<iSchoolCensusStudentData[]> => {
      const resp = await SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          StudentCampus: searchCriteria?.campusCodes,
          ...(fileSemesters.length === 1 ? {FileYear: fileSemesters[0].FileYear, FileSemester: fileSemesters[0].FileSemester} : {
            [OP_OR]: fileSemesters.map(fileSemester => {
              return {FileYear: fileSemester.FileYear, FileSemester: fileSemester.FileSemester};
            })
          }),
        }),
        sort: 'StudentYearLevelSort:ASC,StudentGiven1:ASC,StudentSurname:ASC',
        perPage: 9999,
      })
      return _.uniqBy(
        (resp.data || [])
          .map(row => ({
            ID: row.ID,
            Given1: row.StudentGiven1,
            Surname: row.StudentSurname,
            gender: row.StudentGender,
            dateOfBirth: row.StudentBirthDate,
            studentStatus: row.StudentStatus,
            StudentStatusDescription: row.StudentStatusDescription,
            campusCode: row.StudentCampus,
            entryDate: row.StudentEntryDate,
            leavingDate: `${row.StudentLeavingDate || ''}`.trim(),
            yearLevelCode: `${row.StudentYearLevel}`.trim(),
            visaExpiryDate: `${row.StudentsVisaExpiryDate || ''}`.trim(),
            visaCode: `${row.StudentsVisaType || ''}`.trim(),
            visaNumber: `${row.StudentVisaNumber || ''}`.trim(),
            nccdStatusCategory: '',
            nccdStatusAdjustmentLevel: '',
            isInternationalStudent: row.FullFeeFlag,
            isIndigenous: row.IndigenousFlag,
            isPastStudent: row.StudentIsPastFlag,
          })),
        (record) => record.ID
      )
        .map(record => {
          return {
            ...record,
            age: getAgeFromBirthDate(record.dateOfBirth, startAndEndDateString),
          }
        });
    }

    const loadNccds = async (records: iSchoolCensusStudentData[], startEndDataString: iStartAndEndDateString) => {
      const nccds = await SynVtudentDisabilityAdjustmentService.getAll({
        where: JSON.stringify({
          ID: records.map(record => record.ID),
          DisabilityAdjustmentLevelCode: DISABILITY_ADJUSTMENT_LEVEL_CODES_FOR_CENSUS_REPORT,
        }),
        perPage: 9999,
        sort: 'CurrentDisabilityFlag:ASC',
      });
      const nccdMap = (nccds.data || [])
        .filter(nccd => {
          if (moment(nccd.StartDate).isSameOrAfter(moment(startEndDataString.endDateStr))) {
            return false;
          }
          if (moment(nccd.EndDate).isBefore(moment(startEndDataString.endDateStr))) {
            return false;
          }
          return true;
        })
        .reduce((map, nccd) => {
          return {
            ...map,
            [nccd.ID]: nccd,
          }
        }, {})
      return records.map(record => {
        return {
          ...record,
          // @ts-ignore
          nccdStatusCategory: (record.ID in nccdMap ? nccdMap[record.ID].DisabilityCategory : ''),
          // @ts-ignore
          nccdStatusAdjustmentLevel: (record.ID in nccdMap ? nccdMap[record.ID].DisabilityAdjustmentLevelCode : ''),
        }
      })
    }

    const isConsiderAsStudentRecord = (record: iSchoolCensusStudentData, startEndDataString: iStartAndEndDateString) => {
      if (`${record.entryDate}`.trim() === '' || moment(`${record.entryDate || ''}`.trim()).isSameOrAfter(moment(`${startEndDataString.endDateStr}`))) {
        return false;
      }

      if (`${record.leavingDate || ''}`.trim() !== '' && moment(`${record.leavingDate || ''}`.trim()).isSameOrBefore(moment(`${startEndDataString.endDateStr}`))) {
        return false;
      }

      return true;
    }

    const getSchoolDays = async (startAndEndDateString: iStartAndEndDateString) => {
      const weekDays =
        UtilsService.getWeekdaysBetweenDates(moment(startAndEndDateString.startDateStr), moment(startAndEndDateString.endDateStr))
          .map(day => day.format('YYYY-MM-DD'));
      const results = await  SynCalendarEventService.getAll({
        where: JSON.stringify({
          CalendarType: {[OP_LIKE]: '%D0%'},
          [OP_AND]: [
            {CalendarDate: {[OP_GTE]: startAndEndDateString.startDateStr}},
            {CalendarDate: {[OP_LTE]: startAndEndDateString.endDateStr}},
          ]
        })
      }, {
        headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
            'CalendarDate', 'Comment',
          ])}
      });

      const schoolFreeDays = _.uniq((results.data || []).map(calendarEvent => moment(calendarEvent.CalendarDate).format('YYYY-MM-DD')));
      return _.difference(weekDays, schoolFreeDays);
    }

    const doSearch = async () => {
      const startEndDataString = {
        startDateStr: `${searchCriteria?.startDate || ''}`.trim(),
        endDateStr: `${searchCriteria?.endDate || ''}`.trim()
      }
      const [fileSemesters, schoolDaysStrings] = await Promise.all([
        getFileSemesters(startEndDataString),
        getSchoolDays(startEndDataString),
      ]);
      if (fileSemesters.length <= 0) {
        Toaster.showToast(`The Start and End Date should be within the same term, please change your dates and try again!`, TOAST_TYPE_ERROR);
        return;
      }

      const records = await Promise.all([
        getStudents(fileSemesters, startEndDataString),
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            Campus: (searchCriteria?.campusCodes || []).length === 0 ? SchoolCensusDataExportHelper.defaultCampusCodes : searchCriteria?.campusCodes,
          }),
          sort: 'YearLevelSort:ASC'
        })
      ])
      setYearLevels(records[1]);
      setSchoolDays(schoolDaysStrings);
      if (records[0].length <= 0 || records[1].length <= 0) {
        setStudentRecords(records[0]);
        setUnfilteredStudentRecords(records[0]);
        return;
      }
      const loadedNccds = await loadNccds(records[0], startEndDataString);
      setStudentRecords(loadedNccds.filter(record => isConsiderAsStudentRecord(record, startEndDataString)));
      setUnfilteredStudentRecords(records[0]);
      return;
    }

    setIsLoading(true);
    doSearch()
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false)
      })
    return () => {
      isCanceled = true;
    }
  }, [searchCriteria])

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }

    if (studentRecords === null) {
      return null;
    }

    return (
      <>
        <SchoolCensusDataSummaryDiv
          startAndEndDateString={{startDateStr: `${searchCriteria?.startDate || ''}`, endDateStr: `${searchCriteria?.endDate || ''}`}}
          records={studentRecords}
          unfilteredStudentRecords={unfilteredStudentRecords || []}
          schoolDays={schoolDays}
        />
        <SectionDiv>
          <SchoolCensusTable
            records={studentRecords}
            luYearLevels={yearLevels}
          />
        </SectionDiv>
      </>
    );
  }
  const getExportBtn = () => {
    if (studentRecords === null || studentRecords.length <= 0) {
      return null;
    }
    return (
      <div>
        <CSVExportBtn
          // @ts-ignore
          fetchingFnc={() => new Promise(resolve => {
            resolve(studentRecords)
          })}
          downloadFnc={SchoolCensusDataExportHelper.genCSVFile}
          size={'sm'}
        />
      </div>
    )
  }

  return (
    <Wrapper>
      <h5 className={'title'}>Student Census Report</h5>

      <SchoolCensusDataSearchPanel
        isLoading={isLoading}
        searchFnc={(criteria) => setSearchCriteria(criteria)}
        btns={getExportBtn()}
      />

      <div className={'result-wrapper'}>
        {getContent()}
      </div>
    </Wrapper>
  );
}

export default SchoolCensusDataPanel;
