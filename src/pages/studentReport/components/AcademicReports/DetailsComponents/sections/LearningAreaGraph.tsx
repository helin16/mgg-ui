import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_GRADE,
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_GRADE_JNR
} from '../../../../../../types/Synergetic/iStudentReportResult';
import styled from 'styled-components';
import SectionDiv from './SectionDiv';
import iStudentReportYear from '../../../../../../types/Synergetic/iStudentReportYear';
import iVStudent from '../../../../../../types/Synergetic/iVStudent';
import SynLuYearLevelService from '../../../../../../services/Synergetic/SynLuYearLevelService';
import {Spinner} from 'react-bootstrap';
import ILuYearLevel from '../../../../../../types/Synergetic/iLuYearLevel';
import {CAMPUS_CODE_JUNIOR} from '../../../../../../types/Synergetic/iLuCampus';
import MathHelper from '../../../../../../helper/MathHelper';
import StudentReportService from '../../../../../../services/Synergetic/StudentReportService';
import {OP_NOT} from '../../../../../../helper/ServiceHelper';

type iLearningAreaGraph = {
  student: iVStudent,
  currentStudentReportYear: iStudentReportYear,
  studentReportResults: iStudentReportResult[],
  title?: string;
}

const cellWidth = 26;
const dotWidth = 14;
const halfDotWidth = MathHelper.div(dotWidth, 2);
const posXA = MathHelper.mul(cellWidth, 3);
const posXB = MathHelper.mul(cellWidth, 2);
const posXC = cellWidth;
const posXD = 0;
const posXE = MathHelper.sub(0, cellWidth);
const posXF = MathHelper.sub(0, MathHelper.mul(cellWidth, 2));
const posXG = MathHelper.sub(0, MathHelper.mul(cellWidth, 3));
const Wrapper = styled.div`
  .header-row {
    text-align: center;
  }
  .data-col {
    width: ${cellWidth}px;
    position: relative;
    vertical-align: center;
    &.active {
      background-color: rgba(173, 216, 230, 0.6);
    }
    .dot {
      z-index: 999;
      position: absolute;
      display: inline-block;
      border-radius: 50%;
      width: ${dotWidth}px;
      height: ${dotWidth}px;
      background-color: #ff0000;
      border: 1px #ff0000 solid;

      &.A {
        left: ${MathHelper.sub(posXA, halfDotWidth)}px;
      }
      &.B {
        left: ${MathHelper.sub(posXB, halfDotWidth)}px;
      }
      &.C {
        left: ${MathHelper.sub(posXC, halfDotWidth)}px;
      }
      &.D {
        left: ${MathHelper.sub(posXD, halfDotWidth)}px;
      }
      &.E {
        left: ${MathHelper.sub(posXE, halfDotWidth)}px;
      }
      &.F {
        left: ${MathHelper.sub(posXF, halfDotWidth)}px;
      }
      
      &.previous {
        z-index: 998;
        background-color: white;
        &.A {
          left: ${MathHelper.sub(posXB, halfDotWidth)}px;
        }
        &.B {
          left: ${MathHelper.sub(posXC, halfDotWidth)}px;
        }
        &.C {
          left: ${MathHelper.sub(posXD, halfDotWidth)}px;
        }
        &.D {
          left: ${MathHelper.sub(posXE, halfDotWidth)}px;
        }
        &.E {
          left: ${MathHelper.sub(posXF, halfDotWidth)}px;
        }
        &.F {
          left: ${MathHelper.sub(posXG, halfDotWidth)}px;
        }
      }
    }
    .dot-transit {
      top: ${dotWidth}px;
      z-index: 997;
      height: 1px;
      display: block;
      border-top: 1px dashed black;
      position: absolute;
      width: auto;
      &.f-F {
        left: ${posXG}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 6)}px;
        }
        &.t-B {
          width: ${MathHelper.mul(cellWidth, 5)}px;
        }
        &.t-C {
          width: ${MathHelper.mul(cellWidth, 4)}px;
        }
        &.t-D {
          width: ${MathHelper.mul(cellWidth, 3)}px;
        }
        &.t-E {
          width: ${MathHelper.mul(cellWidth, 2)}px;
        }
        &.t-F {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
      &.f-E {
        left: ${posXF}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 5)}px;
        }
        &.t-B {
          width: ${MathHelper.mul(cellWidth, 4)}px;
        }
        &.t-C {
          width: ${MathHelper.mul(cellWidth, 3)}px;
        }
        &.t-D {
          width: ${MathHelper.mul(cellWidth, 2)}px;
        }
        &.t-E {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
      &.f-D {
        left: ${posXE}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 4)}px;
        }
        &.t-B {
          width: ${MathHelper.mul(cellWidth, 3)}px;
        }
        &.t-C {
          width: ${MathHelper.mul(cellWidth, 2)}px;
        }
        &.t-D {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
      &.f-C {
        left: ${posXD}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 3)}px;
        }
        &.t-B {
          width: ${MathHelper.mul(cellWidth, 2)}px;
        }
        &.t-C {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
      &.f-B {
        left: ${posXC}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 2)}px;
        }
        &.t-B {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
      &.f-A {
        left: ${posXB}px;
        &.t-A {
          width: ${MathHelper.mul(cellWidth, 1)}px;
        }
      }
    }
  }
`;

const AssessAreaResultTypes = [
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_GRADE_JNR,
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_GRADE,
]

const LearningAreaGraph = ({student, currentStudentReportYear, studentReportResults, title = 'Learning Area'}: iLearningAreaGraph) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);
  const [yearLevelMap, setYearLevelMap] = useState<{ [key: number]: ILuYearLevel }>({});
  const [previousStudentReportYear, setPreviousStudentReportYear] = useState<iStudentReportYear | null>(null);
  const [previousStudentReportResultMap, setPreviousStudentReportResultMap] = useState<{ [key: string]: iStudentReportResult }>({});

  useEffect(() => {
    if (studentReportResults.length <=0 ) {
      return;
    }
    setResultList(
      studentReportResults.filter(result => {
          return AssessAreaResultTypes.indexOf(result.AssessAreaResultType.toUpperCase().trim()) >= 0
        })
        .sort((res1, res2) => res1.AssessUnitName > res2.AssessUnitName ? 1 : -1)
    )
  }, [studentReportResults]);


  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    Promise.all([
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            Campus: [CAMPUS_CODE_JUNIOR],
          })
        }),
        StudentReportService.getStudentReportYearsForAStudent(student.ID)
      ])
      .then(resp => {
        if (isCancelled === true) { return }
        setIsLoading(false);
        setYearLevelMap(resp[0].reduce((map, yearLevel) => {
          return {
            ...map,
            [yearLevel.Code]: yearLevel,
          }
        }, {}));

        const sortedReportYears = resp[1].sort((rpt1, rpt2) => {
          return rpt1.FileYear > rpt2.FileYear && rpt1.FileSemester > rpt2.FileSemester ? 1 : -1
        });
        const currentReportYearIndex = _.findIndex(sortedReportYears, (reportYear: iStudentReportYear) => reportYear.ID === currentStudentReportYear.ID);
        if (currentReportYearIndex >= 0 && currentReportYearIndex < sortedReportYears.length) {
          // set to show previous Report year only for Semester 2
          setPreviousStudentReportYear(currentStudentReportYear.FileSemester <= 2 ? null : sortedReportYears[currentReportYearIndex + 1])
        }
      })
    return () => {
      isCancelled = true;
    }
  }, [student, currentStudentReportYear])

  useEffect(() => {
    if (previousStudentReportYear === null) { return }
    let isCancelled = false;
    setIsLoading(true);
    StudentReportService.getStudentReportResultForAStudent(student.ID, previousStudentReportYear.ID || '', {
        where: JSON.stringify({
          AssessAreaResultType: AssessAreaResultTypes,
          AssessResultsResult: {
            [OP_NOT]: ''
          }
        })
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setPreviousStudentReportResultMap(
          resp.reduce((map, result) => {
            return {
              ...map,
              [result.ClassLearningAreaCode]: result
            }
          }, {})
        )
        setIsLoading(false);
      })
    return () => {
      isCancelled = true
    };
  }, [student, previousStudentReportYear]);


  if (resultList.length <= 0) {
    return null;
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  const isSameYearAndSemester = (yearLevelCode: string, fileSemester: number, result: iStudentReportResult | null = null) => {
    if (!result) {
      return false;
    }
    return Number(yearLevelCode) === result?.StudentYearLevel && fileSemester === result?.FileSemester;
  }

  const getDataCell = (yearLevelCode: string, fileSemester: number, result: iStudentReportResult | null = null) => {
    if (result === null) {
      return null;
    }
    const sameYearAndSemester = isSameYearAndSemester(yearLevelCode, fileSemester, result);
    const previousResult = (result.ClassLearningAreaCode in previousStudentReportResultMap) ? previousStudentReportResultMap[result.ClassLearningAreaCode] : null;

    const resultString = `${result.AssessResultsResult?.trim().toUpperCase() || ''}`.trim();
    const previousResultString = `${previousResult?.AssessResultsResult?.trim().toUpperCase() || ''}`.trim();

    return (
      <td
        key={`${yearLevelCode}-${fileSemester}`}
        className={`data-col ${sameYearAndSemester === true ? 'active' : ''}`}
      >
        {sameYearAndSemester === true && resultString !== '' ? (
          <>
            <div className={`dot ${resultString}`} />
            {
              previousResult === null || previousResultString === '' ? null : (
                <>
                  <div className={`dot-transit f-${previousResultString} t-${resultString}`} />
                  <div className={`dot previous ${previousResultString}`} />
                </>
              )
            }
          </>
        ): null}
      </td>
    );
  }

  const getTableTr = (key: string, result: iStudentReportResult | null = null, isHeader = false) => {
    return (
      <tr className={isHeader === true ? 'header-row' : 'data-row'} key={key}>
        { isHeader === true ? <th className={'title-col'} key={'title-col'}></th> : <td className={'title-col'} key={'title-col'}>{result?.AssessUnitName}</td> }
        { isHeader === true ?
          // @ts-ignore
          <th key={'elc'} colSpan={2}>ELC</th> :
          <>{[2, 4].map(fileSemester => <td key={`elc-${fileSemester}`} className={'data-col'}></td>)}</>
        }
        {
          Object.keys(yearLevelMap).map(yearLevelCode => {
            return isHeader === true ?
              // @ts-ignore
              <th key={`${yearLevelCode}`} className={'data-col'} colSpan={2}>Year {yearLevelMap[yearLevelCode].Description}</th> :
              <>{[2, 4].map(fileSemester => getDataCell(yearLevelCode, fileSemester, result))}</>
          })
        }
        { isHeader === true ?
          // @ts-ignore
          <th key={'year7'} colSpan={2}>Year 7</th> :
          <>{[2, 4].map(fileSemester => <td key={`elc-${fileSemester}`} className={'data-col'}></td>)}</>
        }
      </tr>
    )
  }

  return (
    <Wrapper>
      <SectionDiv className={'table-responsive'}>
        <h3 className={'text-danger'}><i>{title}</i></h3>
        <table className={'table table-bordered table-condensed table-striped table-hover'}>
          <thead>
            {getTableTr('tbl-head', null, true)}
          </thead>
          <tbody>
            {resultList.map((result, index) => {
              return getTableTr(`data-row-${index}`, result)
            })}
          </tbody>
        </table>
      </SectionDiv>
    </Wrapper>
  )
};

export default LearningAreaGraph
