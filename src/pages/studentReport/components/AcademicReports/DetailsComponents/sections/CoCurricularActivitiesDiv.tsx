import SectionDiv from '../../../../../../components/common/SectionDiv';
import {useEffect, useState} from 'react';
import iVStudent from '../../../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../../../types/Synergetic/iStudentReportYear';
import iStudentReportCoCurricular from '../../../../../../types/Synergetic/iStudentReportCoCurricular';
import StudentReportService from '../../../../../../services/Synergetic/StudentReportService';
import {Spinner} from 'react-bootstrap';

const CoCurricularActivitiesDiv = ({student, studentReportYear}: {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultList, setResultList] = useState<iStudentReportCoCurricular[]>([]);

  useEffect(() => {
    let isCancelled = false;

    StudentReportService.getStudentReportCoCurricularForAStudent(student.ID, studentReportYear.ID || '')
      .then(resp => {
        if (isCancelled === true) { return }
        setResultList(resp
          .sort((res1, res2) => res1.Description > res2.Description ? 1 : -1)
        );
        setIsLoading(false);
      });

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
      <h3 className={'text-danger'}><i>Co-Curricular Activities</i></h3>
      <ul>
        {
          resultList.map(result => {
            return <li key={result.Description}>{result.Description}</li>
          })
        }
      </ul>
    </SectionDiv>
  )
};

export default CoCurricularActivitiesDiv;
