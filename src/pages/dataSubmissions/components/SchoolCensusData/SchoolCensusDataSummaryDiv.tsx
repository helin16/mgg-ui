import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import {FlexContainer} from '../../../../styles';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import UtilsService from '../../../../services/UtilsService';

type iSchoolCensusDataSummaryDiv = {
  records: iSchoolCensusStudentData[];
};

type iSummary = {
  total: iSchoolCensusStudentData[],
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
    min-width: 140px;
  }
`;
const SchoolCensusDataSummaryDiv = ({records}: iSchoolCensusDataSummaryDiv) => {
  const [summary, setSummary] = useState<iSummary>({
    total: [],
    indigenous: [],
    international: [],
    disability: [],
    withVisa: [],
  });

  useEffect(() => {
    setSummary({
      total: records,
      indigenous: records.filter(record => record.isIndigenous === true),
      international: records.filter(record => record.isInternationalStudent === true),
      disability: records.filter(record => `${record.nccdStatusAdjustmentLevel}`.trim() !== ''),
      withVisa: records.filter(record => `${record.visaNumber}`.trim() !== '' && UtilsService.isNumeric(record.visaCode) && record.isInternationalStudent !== true),
    })
  }, [records]);

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
      {getPanel('title', summary.total)}
      {getPanel('Indigenous', summary.indigenous)}
      {getPanel('International', summary.international)}
      {getPanel('With Visa', summary.withVisa)}
      {getPanel('With Disability', summary.disability)}
    </Wrapper>
  )
}

export default SchoolCensusDataSummaryDiv;
