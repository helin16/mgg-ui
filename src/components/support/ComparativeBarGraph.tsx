import {useEffect, useState} from "react";
import iStudentReportResult from "../../types/Synergetic/Student/iStudentReportResult";
import ComparativeBarGraphDisplay from "./ComparativeBarGraphDisplay";
import StudentReportService from '../../services/Synergetic/Student/StudentReportService';
import Toaster from '../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import iStudentReportYear from '../../types/Synergetic/Student/iStudentReportYear';
import * as _ from 'lodash';
import MathHelper from '../../helper/MathHelper';

type iComparativeBarGraph = {
  results: iStudentReportResult[];
  studentReportYear: iStudentReportYear;
};
const ComparativeBarGraph = ({ results, studentReportYear }: iComparativeBarGraph) => {
  const [cohortScores, setCohortScores] = useState<Number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (results.length <= 0 ){
      setCohortScores([]);
      return;
    }

    const getPercentile = (sortedNumbers: number[], percentile: number) => {
      const percentileIndex = MathHelper.mul(percentile, (sortedNumbers.length - 1));
      const lowerIndex = Math.floor(percentileIndex);
      const upperIndex = Math.ceil(percentileIndex);
      if (lowerIndex === upperIndex) {
        return sortedNumbers[lowerIndex];
      }

      // Interpolate the percentile value between the lower and upper values.
      const lowerValue = sortedNumbers[lowerIndex];
      const upperValue = sortedNumbers[upperIndex];
      const fractionalPart = percentileIndex - lowerIndex;
      return MathHelper.add(lowerValue, MathHelper.mul(fractionalPart, MathHelper.sub(upperValue, lowerValue)));
    }

    let isCanceled = false;
    setIsLoading(true);
    StudentReportService.getStudentReportResults({
        where: JSON.stringify({
          // StudentID: student.StudentID,
          StudentYearLevel: results[0].StudentYearLevel,
          AssessUnitName: results[0].AssessUnitName,
          FileYear: studentReportYear.FileYear,
          FileSemester: studentReportYear.FileSemester,
          AssessableFlag: true,
          ActiveFlag: true,
          AssessAreaNumericFlag: true,
          AssessAreaHeading: ['OVERALL MARK'],
        }),
        perPage: 999999,
        sort: 'ClassLearningAreaDescription:ASC',
      })
      .catch(err => {
        if (isCanceled) { return }
        Toaster.showApiError(err);
      })
      .then(resp => {
        if (isCanceled) { return }
        const sortedScores: number[] = (resp?.data || []).map(result => Number(result.AssessResultsResult)).sort((s1, s2) => {
          return Number(s1) > Number(s2) ? 1 : -1;
        })

        let cScores: number[] = [];
        if (sortedScores.length > 0) {
          if (sortedScores.length <= 6) {
            cScores = [
              sortedScores[0],
              getPercentile(sortedScores, 0.33),
              getPercentile(sortedScores, 0.66),
              sortedScores[sortedScores.length - 1],
            ];
          } else {
            cScores = [
              sortedScores[0],

              getPercentile(sortedScores, 0.2),
              getPercentile(sortedScores, 0.4),
              getPercentile(sortedScores, 0.6),
              getPercentile(sortedScores, 0.8),

              sortedScores[sortedScores.length - 1],
            ]
          }
        }
        setCohortScores(_.uniq(cScores));
      })
      .finally(() => {
        if (isCanceled) { return }
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [results, studentReportYear]);

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  if (results.length <= 0 || cohortScores.length <= 0) {
    return null;
  }

  return (
    <ComparativeBarGraphDisplay
      currentStudentScore={Number(results[0].AssessResultsResult || 0)}
      // @ts-ignore
      cohortScores={cohortScores}
    />
  );
};

export default ComparativeBarGraph;
