import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import SchoolCensusAbsenceSummaryDiv from './SchoolCensusAbsenceSummaryDiv';
import SchoolDaysPopupBtn from './SchoolDaysPopupBtn';
import {FlexContainer} from '../../../../styles';
import SchoolCensusDataAttendancePopupBtn from './SchoolCensusDataAttendancePopupBtn';
import {
  SYN_NATIONALITY_CODE_AUSTRALIA,
  SYN_NATIONALITY_DESCRIPTION_AUSTRALIA
} from '../../../../types/Synergetic/Lookup/iSynLuNationality';
import {SYN_COUNTRY_CODE_AUSTRALIA} from '../../../../types/Synergetic/Lookup/iSynLuCountry';
import {ButtonVariant} from 'react-bootstrap/types';

type iSchoolCensusDataSummaryDiv = {
  records: iSchoolCensusStudentData[];
  unfilteredStudentRecords: iSchoolCensusStudentData[];
  startAndEndDateString: iStartAndEndDateString;
  schoolDays: string[];
  absenteeIdsOnEndDate: number[];
};

type iSummary = {
  total: iSchoolCensusStudentData[],
  aroundTotal: iSchoolCensusStudentData[],
  indigenous: iSchoolCensusStudentData[],
  international: iSchoolCensusStudentData[],
  disability: iSchoolCensusStudentData[],
  withVisa: iSchoolCensusStudentData[],
}
const Wrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  
  .title-row {
    h5 {
      margin-bottom: 0px;
    }
    .btn {
      margin-bottom: 0px;
      margin-top: 0px;
      &.btn-link {
        background-color: transparent !important;
      }
    }
  }
  .summary-divs {
    display: flex;
    flex-flow: wrap;
    gap: 0.7rem;

    .summary-div {
      h5 {
        color: white;
      }
      min-width: 140px;
    }
  }
`;
const SchoolCensusDataSummaryDiv = ({records, unfilteredStudentRecords, startAndEndDateString, schoolDays, absenteeIdsOnEndDate}: iSchoolCensusDataSummaryDiv) => {

  const [summary, setSummary] = useState<iSummary>({
    total: [],
    aroundTotal: [],
    indigenous: [],
    international: [],
    disability: [],
    withVisa: [],
  });

  useEffect(() => {
    setSummary({
      aroundTotal: unfilteredStudentRecords.filter((record) => {
        if (`${record.leavingDate}`.trim() !== '' && moment(`${record.leavingDate}`).isBefore(moment(startAndEndDateString.endDateStr))) {
          return true;
        }
        return false;
      }),
      total: records,
      indigenous: records.filter(record => record.isIndigenous === true),
      international: records.filter(record => record.isInternationalStudent === true),
      disability: records.filter(record => `${record.nccdStatusAdjustmentLevel}`.trim() !== ''),
      withVisa: records.filter(record => {
        if (record.isInternationalStudent === true) {
          return false;
        }
        // any student born in Australia will be filtered out, requested by Kylie on 1st Aug 2023
        if (`${record.studentCountryOfBirthCode || ''}`.trim() === SYN_COUNTRY_CODE_AUSTRALIA) {
          return false;
        }
        // any student with non Australia Nationality
        if (
          `${record.studentNationality}`.trim().toUpperCase() === SYN_NATIONALITY_CODE_AUSTRALIA
          || `${record.studentNationality}`.trim().toUpperCase() === SYN_NATIONALITY_DESCRIPTION_AUSTRALIA
          || `${record.studentNationality2}`.trim().toUpperCase() === SYN_NATIONALITY_CODE_AUSTRALIA
          || `${record.studentNationality2}`.trim().toUpperCase() === SYN_NATIONALITY_DESCRIPTION_AUSTRALIA
        ) {
          return false;
        }
        return true;
      }),
    })
  }, [records, unfilteredStudentRecords, startAndEndDateString]);

  const getPanel = (title: string, recs: iSchoolCensusStudentData[], popupTitle?: any, variant?: ButtonVariant, isForNCCD = false) => {
    return (
      <SchoolCensusDataPopupBtn
        popupTitle={popupTitle}
        records={recs}
        className={'summary-div'}
        variant={variant}
        isForNCCD={isForNCCD}
        totalStudents={summary.total}
        size={'lg'}>
        <h5>{title}</h5>
        <div>{recs.length}</div>
      </SchoolCensusDataPopupBtn>
    )
  }

  return (
    <Wrapper>
      <FlexContainer className={'with-gap lg-gap title-row'}>
        <h5>Total of <SchoolDaysPopupBtn schoolDays={schoolDays} variant={'link'}>{schoolDays.length}</SchoolDaysPopupBtn> School days</h5>
        <SchoolCensusDataAttendancePopupBtn
          popupTitle={
            <FlexContainer className={'with-gap lg-gap align-items end'}>
              <div>Attendee(s) on </div>
              <small className={'text-muted text-size-14'}>
                {moment(startAndEndDateString.startDateStr).format('DD MMM YYYY')} ~ {moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}
              </small>
            </FlexContainer>
          }
          size={'sm'}
          variant={'link'}
          studentIds={unfilteredStudentRecords.map(record => record.ID)}
          schoolDays={schoolDays}
          unfilteredStudentRecords={unfilteredStudentRecords}
          startAndEndDateString={startAndEndDateString}
        >
          Attendances on {moment(startAndEndDateString.startDateStr).format('DD MMM YYYY')} ~ {moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}
        </SchoolCensusDataAttendancePopupBtn>

        <SchoolCensusDataPopupBtn
          size={'sm'}
          variant={'link'}
          popupTitle={
            <FlexContainer className={'with-gap lg-gap'}>
              <h5>{unfilteredStudentRecords.filter((record => absenteeIdsOnEndDate.indexOf(record.ID) >= 0)).length} Absentee(s) on</h5>
              <small className={'text-muted text-size-14'}>
                {moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}
              </small>
            </FlexContainer>
          }
          records={unfilteredStudentRecords.filter((record => absenteeIdsOnEndDate.indexOf(record.ID) >= 0))}
        >
          Absentees on {moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}
        </SchoolCensusDataPopupBtn>

        <SchoolCensusDataAttendancePopupBtn
          disabled={absenteeIdsOnEndDate.length <= 0}
          popupTitle={
            <FlexContainer className={'with-gap lg-gap align-items end'}>
              <div>Attendances for ABSENTEES</div>
              <small className={'text-muted text-size-14'}>
                {moment(startAndEndDateString.startDateStr).format('DD MMM YYYY')} ~ {moment(startAndEndDateString.endDateStr).subtract(1, 'day').format('DD MMM YYYY')}
              </small>
            </FlexContainer>
          }
          size={'sm'}
          variant={'link'}
          studentIds={absenteeIdsOnEndDate}
          schoolDays={schoolDays}
          unfilteredStudentRecords={unfilteredStudentRecords}
          startAndEndDateString={{...startAndEndDateString, endDateStr: moment(startAndEndDateString.endDateStr).subtract(1, 'day').toISOString()}}
        >
          {absenteeIdsOnEndDate.length === 0 ? 'No student was absent' : `Attendances for absentee`} {moment(startAndEndDateString.startDateStr).format('DD MMM YYYY')} ~ {moment(startAndEndDateString.endDateStr).subtract(1, 'day').format('DD MMM YYYY')}
        </SchoolCensusDataAttendancePopupBtn>
      </FlexContainer>
      <div className={'summary-divs'}>
        {getPanel('Total', summary.total, <h4>Total of {summary.total.length} Student{summary.total.length > 1 ? 's' : ''}</h4>)}
        {getPanel('Indigenous', summary.indigenous, <h4>{summary.total.length} <u>Indigenous</u> Student{summary.indigenous.length > 1 ? 's' : ''}</h4>)}
        {getPanel('International', summary.international, <h4>{summary.international.length} <u>International</u> Student{summary.international.length > 1 ? 's' : ''}</h4>)}
        {getPanel('With Visa', summary.withVisa, <h4>{summary.withVisa.length} Student{summary.withVisa.length > 1 ? 's' : ''} <u>with visa</u></h4>)}
        {getPanel('NCCD', summary.disability, <h4>{summary.disability.length} <u>NCCD</u> Student{summary.disability.length > 1 ? 's' : ''}</h4>, undefined, true)}
        {getPanel(
          'Around',
          summary.aroundTotal,
            <>
              <h4>{summary.aroundTotal.length} Student{summary.aroundTotal.length > 1 ? 's' : ''}</h4>
              <small className={'text-muted text-size-14'}>
                left before <u>{moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}</u>
              </small>
            </>
        )}
        <SchoolCensusAbsenceSummaryDiv
          schoolDays={schoolDays}
          unfilteredStudentRecords={unfilteredStudentRecords}
          startAndEndDateString={startAndEndDateString}
          className={'summary-div'}
          size={'lg'}
        />
      </div>
    </Wrapper>
  )
}

export default SchoolCensusDataSummaryDiv;
