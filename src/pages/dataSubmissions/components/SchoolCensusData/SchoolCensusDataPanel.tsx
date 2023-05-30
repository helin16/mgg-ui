import styled from 'styled-components';
import {useEffect, useRef, useState} from 'react';
import FormLabel from '../../../../components/form/FormLabel';
import DateTimePicker from '../../../../components/common/DateTimePicker';
import moment from 'moment-timezone';
import {FlexContainer} from '../../../../styles';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import LocalStorageService from '../../../../services/LocalStorageService';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import Toaster, {TOAST_TYPE_ERROR} from '../../../../services/Toaster';
import SynFileSemesterService from '../../../../services/Synergetic/SynFileSemesterService';
import {OP_GTE, OP_LTE, OP_OR} from '../../../../helper/ServiceHelper';
import * as _ from 'lodash';
import SynVStudentService from '../../../../services/Synergetic/SynVStudentService';
import iSynFileSemester from '../../../../types/Synergetic/iSynFileSemester';
import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import SchoolCensusTable from './SchoolCensusTable';
import SectionDiv from '../../../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import SynVtudentDisabilityAdjustmentService
  from '../../../../services/Synergetic/SynVStudentDisabilityAdjustmentService';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import {CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../../../types/Synergetic/iLuCampus';
import iLuYearLevel from '../../../../types/Synergetic/iLuYearLevel';
import SynLuYearLevelService from '../../../../services/Synergetic/SynLuYearLevelService';
import SynCampusSelector from '../../../../components/student/SynCampusSelector';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import SchoolCensusDataSummaryDiv from './SchoolCensusDataSummaryDiv';

const LOCALSTORAGE_START_AND_END_NAME = 'census_period';

type iStartAndEndDateString = {
  startDateStr: string;
  endDateStr: string;
}
const Wrapper = styled.div``;
const defaultCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];
const SchoolCensusDataPanel = () => {
  const firstInit = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [campusCodes, setCampusCodes] = useState<string[]>(defaultCampusCodes);
  const [studentRecords, setStudentRecords] = useState<iSchoolCensusStudentData[] | null>(null);
  const [yearLevels, setYearLevels] = useState<iLuYearLevel[]>([]);

  useEffect(() => {
    if (firstInit.current !== true) {
      return;
    }
    const local = LocalStorageService.getItem(LOCALSTORAGE_START_AND_END_NAME);
    setStartDate(local.startDate);
    setEndDate(local.endDate);
    setCampusCodes(local.campusCodes);
    firstInit.current = false;
  }, []);

  useEffect(() => {
    if (firstInit.current === true) {
      return;
    }

    LocalStorageService.setItem(LOCALSTORAGE_START_AND_END_NAME, {
      startDate, endDate, campusCodes
    })
  }, [startDate, endDate, campusCodes]);

  const getFileSemesters = async ({ startDateStr,  endDateStr, }:iStartAndEndDateString  ) => {
    const fileSemesters = _.uniqBy(
      (await Promise.all([
        SynFileSemesterService.getFileSemesters({
          where: JSON.stringify({
            ActivatedFlag: true,
            StartDate: {[OP_LTE]: startDateStr},
            EndDate: {[OP_GTE]: startDateStr},
          })
        }),
        SynFileSemesterService.getFileSemesters({
          where: JSON.stringify({
            ActivatedFlag: true,
            StartDate: {[OP_LTE]: endDateStr},
            EndDate: {[OP_GTE]: endDateStr},
          }),
        }),
      ]))
        .reduce((arr, fileSemester) => [...arr, ...fileSemester], []),
      JSON.stringify
    );
    return fileSemesters;
  }

  const getAgeFromBirthDate = (birthDateString: string, { endDateStr, }:iStartAndEndDateString) => {
    const birthStr = `${birthDateString || ''}`.trim();
    if (birthStr === '') {
      return '';
    }
    const age = moment(`${endDateStr}T00:00:00Z`).diff(birthDateString, 'years');
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
        StudentCampus: campusCodes,
        StudentEntryDate: {[OP_LTE]: startAndEndDateString.endDateStr},
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
        .filter(record => {
          if (`${record.StudentYearLevel}`.trim() === '') {
            return false;
          }
          if (`${record.StudentLeavingDate || ''}`.trim() === '' || moment(`${record.StudentLeavingDate || ''}`.trim()).isAfter(moment(`${startAndEndDateString.endDateStr}T00:00:00Z`))) {
            return true;
          }
          return false;
        })
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

  const doSearch = async () => {
    const startEndDataString = {
      startDateStr: `${startDate || ''}`.trim().replace('T00:00:00Z', ''),
      endDateStr: `${endDate || ''}`.trim().replace('T00:00:00Z', '')
    }
    const fileSemesters = await getFileSemesters(startEndDataString);
    if (fileSemesters.length <= 0) {
      Toaster.showToast(`Can't find any activated File Semester in Synergetic, please change your dates and try again!`, TOAST_TYPE_ERROR);
      return;
    }

    const records = await Promise.all([
      getStudents(fileSemesters, startEndDataString),
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: campusCodes.length === 0 ? defaultCampusCodes : campusCodes,
        }),
        sort: 'YearLevelSort:ASC'
      })
    ])
    setYearLevels(records[1]);
    if (records[0].length <= 0 || records[1].length <= 0) {
      setStudentRecords(records[0]);
      return;
    }

    const nccds = await SynVtudentDisabilityAdjustmentService.getAll({
      where: JSON.stringify({
        ID: records[0].map(record => record.ID),
        FileYear: fileSemesters.map(fileSemester => fileSemester.FileYear),
      }),
      perPage: 9999,
      sort: 'CurrentDisabilityFlag:ASC',
    });
    const nccdMap = (nccds.data || []).reduce((map, nccd) => {
      return {
        ...map,
        [nccd.ID]: nccd,
      }
    }, {})
    setStudentRecords(records[0].map(record => {
      return {
        ...record,
        // @ts-ignore
        nccdStatusAdjustmentLevel: (record.ID in nccdMap ? nccdMap[record.ID].DisabilityAdjustmentLevelCode : ''),
      }
    }));
    return;
  }


  const search = () => {
    if (`${startDate || ''}`.trim() === '' || `${endDate || ''}`.trim() === '') {
      Toaster.showToast(`Please provide both Start and End date for Census Period.`, TOAST_TYPE_ERROR);
      return;
    }
    if (moment(startDate).isSameOrAfter(moment(endDate))) {
      Toaster.showToast(`StartDate needs to be before EndDate`, TOAST_TYPE_ERROR);
      return;
    }
    setIsLoading(true);
    doSearch()
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }


  const selectDate = (selected: any, fieldName: string) => {
    const setFunc = (`${fieldName || ''}`.trim() === 'startDate' ? setStartDate: setEndDate);
    if (!selected) {
      setFunc(undefined);
      return;
    }
    const selectedMoment = moment(selected);
    const selectedString = `${selectedMoment.format('YYYY-MM-DD')}T00:00:00Z`;
    setFunc(selectedString);
  }


  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }

    if (studentRecords === null) {
      return null;
    }

    return (
      <>
        <SchoolCensusDataSummaryDiv records={studentRecords} />
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

      <div className={'search-panel'}>
        <div>Census Reference Period</div>
        <FlexContainer className={'with-gap align-items end justify-content space-between'}>
          <FlexContainer className={'with-gap align-items end'}>
            <div>
              <FormLabel label={'Start'} isRequired/>
              <DateTimePicker
                dateFormat={'DD/MMM/YYYY'}
                timeFormat={false}
                value={startDate}
                allowClear
                onChange={(selected) => selectDate(selected, 'startDate')}
              />
            </div>
            <div>
              <FormLabel label={'End'} isRequired/>
              <DateTimePicker
                allowClear
                timeFormat={false}
                dateFormat={'DD/MMM/YYYY'}
                value={endDate}
                onChange={(selected) => selectDate(selected, 'endDate')}
              />
            </div>
            <div>
              <FormLabel label={'Campuses'} isRequired/>
              <SynCampusSelector
                isMulti
                allowClear={false}
                filterEmptyCodes
                values={campusCodes}
                onSelect={(option) => setCampusCodes(option === null ? defaultCampusCodes : Array.isArray(option) ? (option.length === 0 ? defaultCampusCodes : option.map(opt => `${opt.value}`)) : [`${option?.value}`])}
              />
            </div>
            <div style={{height: '100%'}}>
              <FormLabel label={' '} />
              <LoadingBtn isLoading={isLoading} onClick={() => search()}>
                <Icons.Search /> {' '}
                Search
              </LoadingBtn>
            </div>
          </FlexContainer>
          {getExportBtn()}
        </FlexContainer>
      </div>

      <div className={'result-wrapper'}>
        {getContent()}
      </div>
    </Wrapper>
  );
}

export default SchoolCensusDataPanel;
