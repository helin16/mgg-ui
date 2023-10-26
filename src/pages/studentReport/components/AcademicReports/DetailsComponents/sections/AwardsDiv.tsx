import SectionDiv from '../../../../../../components/common/SectionDiv';
import {useEffect, useState} from 'react';
import iVStudent from '../../../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../../../types/Synergetic/iStudentReportYear';
import StudentReportService from '../../../../../../services/Synergetic/Student/StudentReportService';
import {Spinner} from 'react-bootstrap';
import iStudentReportAward from '../../../../../../types/Synergetic/iStudentReportAward';

const AwardsDiv = ({student, studentReportYear}: {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultList, setResultList] = useState<iStudentReportAward[]>([]);

  useEffect(() => {
    let isCancelled = false;

    StudentReportService.getStudentReportAwardsForAStudent(student.ID, studentReportYear.ID || '')
      .then(resp => {
        if (isCancelled === true) { return }
        setResultList(resp
          .sort((res1, res2) => res1.AwardDescription > res2.AwardDescription ? 1 : -1)
        );
        setIsLoading(false);
      })

    return () => {
      isCancelled = true
    };
  }, [student, studentReportYear]);

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  if (resultList.length <= 0) {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>Position Of Responsibility / Awards</i></h3>
      <ul>
        {
          resultList.map(result => {
            return <li key={result.AwardDescription}>{result.AwardDescription}</li>
          })
        }
      </ul>
    </SectionDiv>
  )
};

export default AwardsDiv;
