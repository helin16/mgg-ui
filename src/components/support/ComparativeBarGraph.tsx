import {useEffect, useState} from "react";
import iStudentReportResult from "../../types/Synergetic/iStudentReportResult";
import ComparativeBarGraphDisplay from "./ComparativeBarGraphDisplay";
import StudentReportService from '../../services/Synergetic/StudentReportService';
import Toaster from '../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import iStudentReportYear from '../../types/Synergetic/iStudentReportYear';

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

    let isCanceled = false;
    setIsLoading(true);
    StudentReportService.getStudentReportResults({
        where: JSON.stringify({
          // StudentID: student.StudentID,
          ClassCode: results[0].ClassCode,
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
        if (sortedScores.length <= 0) {
          setCohortScores([])
        } else {
          setCohortScores([
            sortedScores[0],
            sortedScores[Math.floor(0.2 * (sortedScores.length - 1))],
            sortedScores[Math.floor(0.4 * (sortedScores.length - 1))],
            sortedScores[Math.floor(0.6 * (sortedScores.length - 1))],
            sortedScores[Math.floor(0.8 * (sortedScores.length - 1))],
            sortedScores[sortedScores.length - 1],
          ]);
        }
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
