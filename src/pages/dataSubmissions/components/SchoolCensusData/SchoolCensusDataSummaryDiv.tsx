import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import UtilsService from '../../../../services/UtilsService';
import moment from 'moment-timezone';

type iSchoolCensusDataSummaryDiv = {
  records: iSchoolCensusStudentData[];
  unfilteredStudentRecords: iSchoolCensusStudentData[];
  startAndEndDateString: iStartAndEndDateString;
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
  display: flex;
  flex-flow: wrap;
  gap: 0.7rem;
  
  .summary-div {
    h5 {
      color: white;
    }
    min-width: 140px;
  }
`;
const SchoolCensusDataSummaryDiv = ({records, unfilteredStudentRecords, startAndEndDateString}: iSchoolCensusDataSummaryDiv) => {
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
        if(record.isInternationalStudent === true || `${record.visaExpiryDate}`.trim() === '' || !UtilsService.isNumeric(record.visaCode)) {
          return false;
        }
        if (`${record.visaCode}`.trim() === '155') {
          return false;
        }
        return true;
      }),
    })
  }, [records, unfilteredStudentRecords, startAndEndDateString]);

  const getPanel = (title: string, recs: iSchoolCensusStudentData[], popupTitle?: any) => {
    return (
      <SchoolCensusDataPopupBtn
        popupTitle={popupTitle}
        records={recs}
        className={'summary-div'}
        size={'lg'}>
        <h5>{title}</h5>
        <div>{recs.length}</div>
      </SchoolCensusDataPopupBtn>
    )
  }

  return (
    <Wrapper>
      {getPanel('Total', summary.total, <h4>Total of {summary.total.length} Student{summary.total.length > 1 ? 's' : ''}</h4>)}
      {getPanel('Indigenous', summary.indigenous, <h4>{summary.total.length} <u>Indigenous</u> Student{summary.indigenous.length > 1 ? 's' : ''}</h4>)}
      {getPanel('International', summary.international, <h4>{summary.international.length} <u>International</u> Student{summary.international.length > 1 ? 's' : ''}</h4>)}
      {getPanel('With Visa', summary.withVisa, <h4>{summary.withVisa.length} Student{summary.withVisa.length > 1 ? 's' : ''} <u>with visa</u></h4>)}
      {getPanel('NCCD', summary.disability, <h4>{summary.disability.length} <u>NCCD</u> Student{summary.disability.length > 1 ? 's' : ''}</h4>)}
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
    </Wrapper>
  )
}

export default SchoolCensusDataSummaryDiv;
