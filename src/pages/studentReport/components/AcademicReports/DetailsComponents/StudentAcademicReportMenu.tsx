import * as _ from 'lodash';
import PanelTitle from '../../../../../components/PanelTitle';
import styled from 'styled-components';
import {Button, Spinner} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {iStudentAcademicReportResultMap, StudentAcademicReportDetailsProps} from '../StudentAcademicReportDetails';
import {useEffect, useState} from 'react';
import StudentAcademicEmailPopup from './StudentAcademicEmailPopup';
import {
  STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC, STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS
} from '../../../../../types/student/iStudentReportResult';
import LinkBtn from '../../../../../components/common/LinkBtn';
import {getStudentReportClassname} from './Helpers/AcademicReportHelper';

const Wrapper = styled.div`
  margin-bottom: 0.4rem;
  .course-list {
    padding-top: 8px;
  }
`

const StudentAcademicReportMenu = ({
  isLoading,
  student,
  studentReportYear,
  onClearReportYear,
  onClearSelectedStudent,
  studentReportResultMap,
  onSelectedCourse,
  selectedCourseCode = '',
}: StudentAcademicReportDetailsProps & {
  isLoading: boolean;
  studentReportResultMap: iStudentAcademicReportResultMap;
  selectedCourseCode?: string;
  onSelectedCourse: (classCode: string) => void
}) => {
  const [showingEmailPopup, setShowingEmailPopup] = useState(false);
  const [academicCourseMap, setAcademicCourseMap] = useState({});
  const [otherCourseMap, setOtherCourseMap] = useState({});

  useEffect(() => {
    const sortedCourses = _.flatMapDeep(Object.values(studentReportResultMap))
      .sort((reprt1, reprt2) => {
        return reprt1.AssessHeading > reprt2.AssessHeading ? 1 : -1;
      });
    setAcademicCourseMap(sortedCourses
      .filter(course => course.FileType === STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC)
      .reduce((map, studentReportResult) => {
        return {
          ...map,
          [studentReportResult.ClassCode]: studentReportResult,
        };
    }, {}))
    setOtherCourseMap(sortedCourses
      .filter(course => course.FileType !== STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC)
      .reduce((map, studentReportResult) => {
        return {
          ...map,
          [studentReportResult.ClassCode]: studentReportResult,
        };
      }, {}))
  }, [JSON.stringify(studentReportResultMap)])

  const getEmailPopup = () => {
    if (showingEmailPopup !== true) {
      return null;
    }
    return <StudentAcademicEmailPopup
      student={student}
      studentReportYear={studentReportYear}
      onClose={() => setShowingEmailPopup(false)}
    />;
  }

  const getItemClassName = (classCode: string) => {
    return selectedCourseCode === classCode ? 'course-item active' : 'course-item';
  }

  const getComparativeCourse = () => {
    if(studentReportYear.IncludeComparative !== true) {
      return null;
    }
    return (
      <li>
        <LinkBtn
          className={getItemClassName(STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS)}
          onClick={() => onSelectedCourse(STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS)}>
            {STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS}
        </LinkBtn>
      </li>
    )
  }

  const getCourseList = () => {
    return (
      <div className={'course-list'}>
        <ul>
          <li>
            <LinkBtn className={getItemClassName('')} onClick={() => onSelectedCourse('')}>
              Explanation of Results
            </LinkBtn>
          </li>
          {getComparativeCourse()}
          {Object.keys(academicCourseMap).map(courseCode => {
            return (
              <li key={courseCode}>
                {/*// @ts-ignore*/}
                <LinkBtn className={getItemClassName(courseCode)} onClick={() => onSelectedCourse(courseCode)}>{academicCourseMap[courseCode].AssessHeading}</LinkBtn>
              </li>
            );
          })}
          {Object.keys(otherCourseMap).map(courseCode => {
            return (
              <li key={courseCode}>
                {/*// @ts-ignore*/}
                <LinkBtn className={getItemClassName(courseCode)} onClick={() => onSelectedCourse(courseCode)}>{getStudentReportClassname(otherCourseMap[courseCode])}</LinkBtn>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }
    return (
      <div>
        {getCourseList()}
        <div className="d-grid gap-2">
          <Button variant={'info'}><Icon.CloudArrowDown /> Download PDF Report</Button>
          <Button variant={'danger'} onClick={() => setShowingEmailPopup(true)}><Icon.Envelope /> Email PDF Report</Button>
          <Button variant={'danger'} onClick={() => onClearReportYear ? onClearReportYear() : null }>
            <Icon.ListUl /> All {student.StudentGiven1}'s Reports
          </Button>
          <Button variant={'danger'} onClick={() => onClearSelectedStudent ? onClearSelectedStudent() : null }>
            <Icon.Search /> Back to Search
          </Button>
        </div>
        {getEmailPopup()}
      </div>
    )
  }

  return (
    <Wrapper>
      <h3>Available Reports</h3>
      <PanelTitle>{studentReportYear.FileYear} Semester {studentReportYear.FileSemester} Academic Report</PanelTitle>
      {getContent()}
    </Wrapper>
  )
};

export default StudentAcademicReportMenu;
