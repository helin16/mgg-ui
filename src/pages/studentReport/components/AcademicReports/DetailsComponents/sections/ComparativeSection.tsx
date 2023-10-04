import {ResultTableWrapper} from './GraphTable';
import ComparativeBarGraph from '../../../../../../components/support/ComparativeBarGraph';
import React from 'react';
import SectionDiv from '../../../../../../components/common/SectionDiv';

const ComparativeSection = () => {
  return (
    <SectionDiv>
      <ResultTableWrapper>
        <div className={'result-row'}>
          <div>
            <b>Comparative</b>
            <div>
              The comparative result for this subject
            </div>
          </div>
          <div className={'result-table'}><ComparativeBarGraph cohortScores={[45, 75, 60, 80, 90, 98]} currentStudentScore={60} /></div>
        </div>
      </ResultTableWrapper>
    </SectionDiv>
  )
}

export default ComparativeSection;
