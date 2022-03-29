import iVStudent from '../../../../types/student/iVStudent';
import iStudentReportYear from '../../../../types/student/iStudentReportYear';
import CoverLetter from './DetailsComponents/pages/CoverLetter';
import {Col, Row} from 'react-bootstrap';
import StudentAcademicReportMenu from './DetailsComponents/StudentAcademicReportMenu';
import {useEffect, useState} from 'react';
import iStudentReportResult, {
  STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS
} from '../../../../types/student/iStudentReportResult';
import StudentReportService from '../../../../services/StudentReportService';
import StudentAcademicSubjectDetails from './DetailsComponents/StudentAcademicSubjectDetails';
import ComparativeAnalysis from './DetailsComponents/pages/ComparativeAnalysis';

export type StudentAcademicReportDetailsProps = {
  student: iVStudent,
  studentReportYear: iStudentReportYear,
  onClearSelectedStudent?: () => void
  onClearReportYear?: () => void
};

export type iStudentAcademicReportResultMap = {[key: string]: iStudentReportResult[]}

const StudentAcademicReportDetails = ({
  student,
  studentReportYear,
  onClearReportYear,
  onClearSelectedStudent,
}: StudentAcademicReportDetailsProps) => {
  const [studentReportResult, setStudentReportResult] = useState<iStudentReportResult | null>(null);
  const [studentReportResultMap, setStudentReportResultMap] = useState<iStudentAcademicReportResultMap>({});
  const [selectedClassCode, setSelectedClassCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCanceled = false;

    StudentReportService.getStudentReportResultForAStudent(`${student.ID}`, `${studentReportYear.ID}`)
      .then(resp => {
        if (isCanceled) { return }
        if (resp.length > 0) {
          setStudentReportResult(resp[0]);
        }
        const map = resp.reduce((map, studentReportResult) => {
          return {
            ...map,
            [studentReportResult.ClassCode]: (
              studentReportResult.ClassCode in map ?
                // @ts-ignore
                [...map[studentReportResult.ClassCode], studentReportResult]
                : [studentReportResult]
            )
          }
        }, {});
        setStudentReportResultMap(map);
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [JSON.stringify(student), JSON.stringify(studentReportYear)]);


  const getSpecialPage = () => {
    if (selectedClassCode === STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS) {
      return <ComparativeAnalysis student={student} studentReportYear={studentReportYear} studentReportResult={studentReportResult}/>
    }
    return <CoverLetter student={student} studentReportYear={studentReportYear} />;
  }

  const getDetailsPanel = () => {
    if (!studentReportResultMap[selectedClassCode] || studentReportResultMap[selectedClassCode].length <= 0) {
      return getSpecialPage();
    }

    return <StudentAcademicSubjectDetails
      student={student}
      studentReportYear={studentReportYear}
      selectedReportResults={studentReportResultMap[selectedClassCode] || []}
    />
  }

  return (
    <Row>
      <Col md={3} lg={{order: 'last', span: 3}}>
        <StudentAcademicReportMenu
          isLoading={isLoading}
          student={student}
          studentReportYear={studentReportYear}
          onClearReportYear={onClearReportYear}
          onClearSelectedStudent={onClearSelectedStudent}
          studentReportResultMap={studentReportResultMap}
          selectedCourseCode={selectedClassCode}
          onSelectedCourse={(classCode) => setSelectedClassCode(classCode)}
        />
      </Col>
      <Col>
        {getDetailsPanel()}
      </Col>
    </Row>
  )
};

export default StudentAcademicReportDetails;
