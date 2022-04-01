import * as _ from 'lodash';
import PanelTitle from '../../../../../components/PanelTitle';
import styled from 'styled-components';
import {Button, Spinner} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {iStudentAcademicReportResultMap, StudentAcademicReportDetailsProps} from '../StudentAcademicReportDetails';
import {useEffect, useState} from 'react';
import StudentAcademicEmailPopup from './StudentAcademicEmailPopup';
import iStudentReportResult, {
  STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC, STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS
} from '../../../../../types/student/iStudentReportResult';
import LinkBtn from '../../../../../components/common/LinkBtn';

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
  const [homeGroupCourseMap, setHomeGroupCourseMap] = useState({});
  const [academicCourseMap, setAcademicCourseMap] = useState({});
  const [otherCourseMap, setOtherCourseMap] = useState({});

  useEffect(() => {
    const sortedCourses = _.flatMapDeep(Object.values(studentReportResultMap))
      .sort((reprt1, reprt2) => {
        return reprt1.AssessHeading > reprt2.AssessHeading ? 1 : -1;
      });

    const setCourseMap = (
      courseList: iStudentReportResult[],
      setFn: (data: any) => void,
      filterFn: (course: iStudentReportResult) => boolean
    ) => {
      setFn(courseList
        .filter(filterFn)
        .reduce((map, studentReportResult) => {
          return {
            ...map,
            [studentReportResult.ClassCode]: studentReportResult,
          };
        }, {}));
    }
    setCourseMap(sortedCourses, setHomeGroupCourseMap, course => course.isHomeGroup === true);
    setCourseMap(sortedCourses, setAcademicCourseMap, course => course.isHomeGroup === false && course.FileType === STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC);
    setCourseMap(sortedCourses, setOtherCourseMap, course => course.isHomeGroup === false && course.FileType !== STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC);
  }, [studentReportResultMap])

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

  const getListOfCourseNames = (courseMap: {[key: string]: iStudentReportResult}, contactNames: boolean = false) => {
    const courseCodes = Object.keys(courseMap);
    if (courseCodes.length <= 0) {
      return null;
    }

    const getCourseName = (courseCode: string) => {
      if (!(courseCode in courseMap)) {
        return '';
      }
      if (contactNames === true) {
        return `${courseMap[courseCode].AssessHeading || ''} ${courseMap[courseCode].ClassDescription}`
      }
      return `${courseMap[courseCode].AssessHeading || ''}`
    }
    return courseCodes.map(courseCode => {
      if (!(courseCode in courseMap)) {
        return null;
      }
      return (
        <li key={courseCode}>
          {/*// @ts-ignore*/}
          <LinkBtn className={getItemClassName(courseCode)} onClick={() => onSelectedCourse(courseCode)}>{getCourseName(courseCode)}</LinkBtn>
        </li>
      );
    })
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
          {getListOfCourseNames(homeGroupCourseMap)}

          {getComparativeCourse()}

          {getListOfCourseNames(academicCourseMap)}
          {getListOfCourseNames(otherCourseMap, true)}
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
      <h4>Available Reports</h4>
      <PanelTitle>{studentReportYear.FileYear} Semester {studentReportYear.FileSemester / 2} Report</PanelTitle>
      {getContent()}
    </Wrapper>
  )
};

export default StudentAcademicReportMenu;
