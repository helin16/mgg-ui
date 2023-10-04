import React from 'react';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import Toaster, {TOAST_TYPE_ERROR} from '../../../../services/Toaster';
import SynFileSemesterService from '../../../../services/Synergetic/SynFileSemesterService';
import {OP_OR} from '../../../../helper/ServiceHelper';
import * as _ from 'lodash';
import SynVStudentService from '../../../../services/Synergetic/SynVStudentService';
import iSynFileSemester from '../../../../types/Synergetic/iSynFileSemester';
import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusTable from './SchoolCensusTable';
import SectionDiv from '../../../../components/common/SectionDiv';
import SynVtudentDisabilityAdjustmentService
  from '../../../../services/Synergetic/SynVStudentDisabilityAdjustmentService';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import ISynLuYearLevel from '../../../../types/Synergetic/Lookup/iSynLuYearLevel';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';
import SchoolCensusDataSummaryDiv from './SchoolCensusDataSummaryDiv';
import {
  DISABILITY_ADJUSTMENT_LEVEL_CODES_FOR_CENSUS_REPORT
} from '../../../../types/Synergetic/iSynVStudentDisabilityAdjustment';
import SchoolCensusDataSearchPanel, {iSchoolCensusDataSearchCriteria} from './SchoolCensusDataSearchPanel';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import SynVAbsenceService from '../../../../services/Synergetic/Absence/SynVAbsenceService';

const Wrapper = styled.div``;

const SchoolCensusDataPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [studentRecords, setStudentRecords] = useState<iSchoolCensusStudentData[] | null>(null);
  const [unfilteredStudentRecords, setUnfilteredStudentRecords] = useState<iSchoolCensusStudentData[] | null>(null);
  const [schoolDays, setSchoolDays] = useState<string[]>([]);
  const [yearLevels, setYearLevels] = useState<ISynLuYearLevel[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<iSchoolCensusDataSearchCriteria | null>(null);
  const [absenteeOnEndDateIds, setAbsenteeOnEndDateIds] = useState<number[]>([]);


  useEffect(() => {
    if (searchCriteria === null) return;
    let isCanceled = false;
    const getAgeFromBirthDate = (birthDateString: string, { endDateStr, }:iStartAndEndDateString) => {
      const birthStr = `${birthDateString || ''}`.trim();
      if (birthStr === '') {
        return '';
      }
      const age = Math.floor(moment(`${moment(endDateStr).year()}-07-01T00:00:00Z`).diff(birthDateString, 'month') / 12);
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
        include: 'StudentPassportCountry',
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
            visaIssueDate: `${row.StudentVisaIssuedDate || ''}`.trim(),
            visaCode: `${row.StudentsVisaType || ''}`.trim(),
            visaNumber: `${row.StudentVisaNumber || ''}`.trim(),
            nccdStatusCategory: '',
            nccdStatusAdjustmentLevel: '',
            isInternationalStudent: row.FullFeeFlag,
            isIndigenous: row.IndigenousFlag,
            isPastStudent: row.StudentIsPastFlag,
            studentPassportCountryCode: `${row.StudentPassportCountryCode || ''}`,
            studentPassportIssueCountry: `${row.StudentPassportCountry?.Description || ''}`,
            studentPassportNo: `${row.StudentsPassportNo || ''}`,
            studentPassportIssuedDate: `${row.StudentPassportIssuedDate || ''}`,
            studentPassportExpiryDate: `${row.StudentPassportExpiryDate || ''}`,

            studentCountryOfBirthCode: `${row.StudentCountryOfBirthCode || ''}`,
            studentCountryOfBirth: `${row.StudentCountryOfBirthDescription || ''}`,
            studentNationality: `${row.StudentNationalityCode || ''}`.trim() === '' ? '' : `${row.StudentNationalityDescription || ''}`,
            studentNationality2: `${row.StudentNationality2Code || ''}`.trim() === '' ? '' : `${row.StudentNationality2Description || ''}`,
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
          IncludeInExportFlag: true,
        }),
        perPage: 9999,
        sort: 'CurrentDisabilityFlag:ASC',
      });
      const nccdMap = (nccds.data || [])
        .filter(nccd => {
          if (`${nccd.StartDate || ''}`.trim() !== '' && moment(nccd.StartDate).isSameOrAfter(moment(startEndDataString.endDateStr))) {
            return false;
          }
          if (`${nccd.EndDate || ''}`.trim() !== '' && moment(nccd.EndDate).isBefore(moment(startEndDataString.endDateStr))) {
            return false;
          }
          // console.log('nccd', nccd)
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

    const getSchoolDays = (startAndEndDateString: iStartAndEndDateString) => {
      return SynFileSemesterService.getSchoolDays({
        start:  moment(startAndEndDateString.startDateStr).format('YYYY-MM-DD'),
        end:  moment(startAndEndDateString.endDateStr).format('YYYY-MM-DD'),
      });
    }

    const getAbsenteesOnEndDate = async (records: iSchoolCensusStudentData[], startAndEndDateString: iStartAndEndDateString) => {
      const result = await SynVAbsenceService.getAll({
        where: JSON.stringify({
          SynergyMeaning: 'AllDayAbsence',
          // ID: 50804,
          ID: records.map(rec => rec.ID),
          AbsenceDate: startAndEndDateString.endDateStr,
        }),
        perPage: 9999999,
      });
      return result.data || [];
    }

    const doSearch = async () => {
      const startEndDataString = {
        startDateStr: `${searchCriteria?.startDate || ''}`.trim(),
        endDateStr: `${searchCriteria?.endDate || ''}`.trim()
      }
      const [{ endDateFileSemesters, }, schoolDaysStrings] = await Promise.all([
        SynFileSemesterService.getFileSemesterFromStartAndEndDate(startEndDataString),
        getSchoolDays(startEndDataString),
      ]);

      if (endDateFileSemesters.length <= 0) {
        Toaster.showToast(`The End Date should be within the a FileSemester, please change your dates and try again!`, TOAST_TYPE_ERROR);
        return;
      }
      if (isCanceled) return;
      const records = await Promise.all([
        getStudents([...endDateFileSemesters], startEndDataString),
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            Campus: (searchCriteria?.campusCodes || []).length === 0 ? SchoolCensusDataExportHelper.defaultCampusCodes : searchCriteria?.campusCodes,
          }),
          sort: 'YearLevelSort:ASC'
        })
      ]);

      if (isCanceled) return;
      setYearLevels(records[1]);
      setSchoolDays(schoolDaysStrings);
      if (records[0].length <= 0 || records[1].length <= 0) {
        setStudentRecords(records[0]);
        setUnfilteredStudentRecords(records[0]);
        setAbsenteeOnEndDateIds([]);
        return;
      }
      const [loadedNccds, absenteesOnEndDate] = await Promise.all([
        loadNccds(records[0], startEndDataString),
        getAbsenteesOnEndDate(records[0], startEndDataString),
      ]);

      if (isCanceled) return;
      setAbsenteeOnEndDateIds(_.uniq(absenteesOnEndDate.map(record => record.ID)));
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
          absenteeIdsOnEndDate={absenteeOnEndDateIds}
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
      <ExplanationPanel
        text={
          <>
            All student ages are calculated base on <b>1st of July</b> in the selected year (ie: 2022).
            <div>- <b>School Days</b>: The days that students are supposed to be at school.</div>
            <div>- <b>Total students</b>: list of all students who are here during the Census Reference Period.</div>
            <div>- <b>International</b>: list of students who are marked as <u>Full Fee</u>.</div>
            <div>- <b>With Visa</b>: list of students who are marked as NOT <u>Full Fee</u>, not born in Australia and not having Australian Nationality.</div>
            <div>- <b>NCCD</b>: list of students who have disabilities level in {DISABILITY_ADJUSTMENT_LEVEL_CODES_FOR_CENSUS_REPORT.map((code) => <React.Fragment key={code}> <u>{code}</u></React.Fragment>)}.</div>
            <div>- <b>Around</b>: list of students who were here and left before End of Census Reference Period.</div>
            <div>- <b>Total Absence</b>: list of students who are absent the entire Census Reference Period.</div>
          </>
        }
      />

      <SchoolCensusDataSearchPanel
        title={<div>Census Reference Period</div>}
        defaultNoOfBusinessDaysBeforeEndDay={20}
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
