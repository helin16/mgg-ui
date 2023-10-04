import styled from 'styled-components';
import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import {ProgressBar} from 'react-bootstrap';
import SectionDiv from '../../../../../../components/common/SectionDiv';
import * as _ from 'lodash';

export const ResultTableWrapper = styled.div`
  .result-row {
    display: flex;
    //padding: 2px 0;
    justify-content: space-between;
    align-items: flex-start;
    
    &.title-row {
      font-weight: bold;
    }
    
    .result-table {
      width: 380px;
      display: flex;
      justify-content: space-between;
      .progress {
        width: 100%;
      }
    }
  }
`

export type iResultTranslateResult = {name: string; width: number};
export type iResultTranslateMap = {[key: string | number]: iResultTranslateResult};
export type iGraphTable = {
  title: string;
  results: iStudentReportResult[],
  resultTranslateMap?: iResultTranslateMap,
  resultTranslateFn?: (result: string | null, map: iResultTranslateMap) => undefined | iResultTranslateResult;
}
const defaultResultTranslateFn = (result: string | null, map: iResultTranslateMap) => {
  const key = `${result || ''}`;
  if (!(key in map)) {
    return undefined;
  }
  return map[key];
}


const GraphTable = ({
  results, title, resultTranslateMap, resultTranslateFn
}: iGraphTable) => {

  const resultTableClassName = 'text-right d-none d-xl-block d-xxl-block';
  const resultTextClassName = 'text-right d-block d-xl-none d-xxl-none';
  const resultTranslateFunction = resultTranslateFn || defaultResultTranslateFn;

  const getResultColTitle = () => {
    if (!resultTranslateMap) {
      return <div className={'text-right'}>Result</div>
    }
    return (
      <>
        <div className={resultTableClassName}>
          <div className={'result-table'}>
            {
              Object.values(resultTranslateMap).map(titleObj => {
                return <div key={titleObj.name} className={'text-center cell'}>{titleObj.name}</div>
              })
            }
          </div>
        </div>
        <div className={resultTextClassName}>Result</div>
      </>
    )
  }

  if (results.length <= 0) {
    return null;
  }

  return (
    <SectionDiv>
      <ResultTableWrapper>
        <div className={'result-row title-row'}>
          <div className={'text-uppercase'}>{title}</div>
          {getResultColTitle()}
        </div>
        {_.uniqBy(results, (result) => result.AssessAreaHeading)
          .map(result => {
          if (!resultTranslateMap) {
            return (
              <div key={result.AssessAreaHeading} className={'result-row'}>
                <div>{result.AssessAreaHeading}</div>
                <div className={'text-right'}>{result.isNA === true ? <i>Not Assessed</i> : result.AssessResultsResult}</div>
              </div>
            );
          }

          const resultObj = resultTranslateFunction(result.AssessResultsResult, resultTranslateMap);
          if (!resultObj) {
            return null;
          }
          return (
            <div key={result.AssessAreaHeading} className={'result-row'}>
              <div>{result.AssessAreaHeading}</div>
              <div className={resultTableClassName}>
                <div className={'result-table'}>
                  <ProgressBar variant="danger" now={Number(resultObj.width)} />
                </div>
              </div>
              <div className={resultTextClassName}>{resultObj.name}</div>
            </div>
          )
        })}
      </ResultTableWrapper>
    </SectionDiv>
  )
};

export default GraphTable;
