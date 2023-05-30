import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import UtilsService from '../../../../services/UtilsService';

type iSchoolCensusDataSummaryDiv = {
  records: iSchoolCensusStudentData[];
  aroundRecords: iSchoolCensusStudentData[];
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
const SchoolCensusDataSummaryDiv = ({records, aroundRecords, startAndEndDateString}: iSchoolCensusDataSummaryDiv) => {
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
      aroundTotal: aroundRecords,
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
  }, [records, aroundRecords]);

  const getPanel = (title: string, recs: iSchoolCensusStudentData[]) => {
    return (
      <SchoolCensusDataPopupBtn
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
      {getPanel('Total', summary.total)}
      {getPanel('Indigenous', summary.indigenous)}
      {getPanel('International', summary.international)}
      {getPanel('With Visa', summary.withVisa)}
      {getPanel('With Disability', summary.disability)}
      {getPanel('Around', summary.aroundTotal)}
    </Wrapper>
  )
}

export default SchoolCensusDataSummaryDiv;
