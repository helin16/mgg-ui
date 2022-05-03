import iVStudent from '../../../../types/Synergetic/iVStudent';
import iStudentReportYear from '../../../../types/Synergetic/iStudentReportYear';
import {STUDENT_REPORT_YEAR_STYLE_JNR_GRAPH} from '../../../../types/Synergetic/iStudentReportStyle';
import CoverLetterPage from './DetailsComponents/pages/CoverLetterPage';
import {Col, Row} from 'react-bootstrap';
import StudentAcademicReportMenu from './DetailsComponents/StudentAcademicReportMenu';
import {useEffect, useState} from 'react';
import iStudentReportResult, {
  STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS
} from '../../../../types/Synergetic/iStudentReportResult';
import StudentReportService from '../../../../services/Synergetic/StudentReportService';
import StudentAcademicSubjectPage from './DetailsComponents/pages/StudentAcademicSubjectPage';
import ComparativeAnalysisPage from './DetailsComponents/pages/ComparativeAnalysisPage';
import HomeGroupPage from './DetailsComponents/pages/HomeGroupPage';
import JnrGraphHomeGroupPage from './DetailsComponents/pages/JnrGraphHomeGroupPage';

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
  }, [student, studentReportYear]);


  const getSpecialPage = () => {
    if (selectedClassCode === STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS) {
      return <ComparativeAnalysisPage student={student} studentReportYear={studentReportYear} studentReportResult={studentReportResult}/>
    }
    return <CoverLetterPage student={student} studentReportYear={studentReportYear} studentReportResult={studentReportResult} />;
  }

  const getHomeGroupPage = () => {
    if (studentReportYear.styleCode === STUDENT_REPORT_YEAR_STYLE_JNR_GRAPH) {
      return <JnrGraphHomeGroupPage
        student={student}
        studentReportYear={studentReportYear}
        selectedClassCode={selectedClassCode || ''}
        studentReportResultMap={studentReportResultMap || {}}
      />
    }
    return <HomeGroupPage
      student={student}
      studentReportYear={studentReportYear}
      selectedReportResults={studentReportResultMap[selectedClassCode] || []}
    />
  }

  const getDetailsPanel = () => {
    if (!studentReportResultMap[selectedClassCode] || studentReportResultMap[selectedClassCode].length <= 0) {
      return getSpecialPage();
    }

    if (studentReportResultMap[selectedClassCode][0].isHomeGroup === true) {
      return getHomeGroupPage();
    }

    return <StudentAcademicSubjectPage
      student={student}
      studentReportYear={studentReportYear}
      selectedReportResults={studentReportResultMap[selectedClassCode] || []}
    />
  }

  return (
    <Row>
      <Col md={3} lg={{order: 'last', span: 2}}>
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
