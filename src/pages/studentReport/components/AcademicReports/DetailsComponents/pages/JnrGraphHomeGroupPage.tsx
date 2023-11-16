import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import {StudentAcademicSubjectPageHeader, SubjectPageWrapper} from './StudentAcademicSubjectPage';
import AttitudeAndManagementDiv from '../sections/AttitudeAndManagementDiv';
import ReflectionDiv from '../sections/RefelectionDiv';
import CommentsDiv from '../sections/CommentsDiv';
import CoCurricularActivitiesDiv from '../sections/CoCurricularActivitiesDiv';
import AwardsDiv from '../sections/AwardsDiv';
import TeachersDiv from '../sections/TeacherDiv';
import ApproachesToLearningDiv from '../sections/ApproachesToLearningDiv';
import {iStudentAcademicReportResultMap} from '../../StudentAcademicReportDetails';
import iVStudent from '../../../../../../types/Synergetic/Student/iVStudent';
import iStudentReportYear from '../../../../../../types/Synergetic/Student/iStudentReportYear';
import iStudentReportResult from '../../../../../../types/Synergetic/Student/iStudentReportResult';
import LearningAreaGraph from '../sections/LearningAreaGraph';
import LearningAgencyDiv from '../sections/LearningAgencyDiv';

type iJnrGraphHomeGroupPage = {
  student: iVStudent;
  selectedClassCode: string;
  studentReportYear: iStudentReportYear;
  studentReportResultMap: iStudentAcademicReportResultMap
}

const JnrGraphHomeGroupPage = ({
  student, studentReportYear, studentReportResultMap, selectedClassCode
}: iJnrGraphHomeGroupPage) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([])

  useEffect(() => {
    if (!(selectedClassCode in studentReportResultMap)) {
      return
    }
    setResultList(studentReportResultMap[selectedClassCode]);
  }, [selectedClassCode, studentReportResultMap])

  if (resultList.length <= 0) {
    return null;
  }

  return (
    <SubjectPageWrapper className={'jnr-graph-home-group-wrapper'}>
      <StudentAcademicSubjectPageHeader
        student={student}
        studentReportYear={studentReportYear}
        selectedReportResults={resultList}
      />

      <LearningAreaGraph
        student={student}
        currentStudentReportYear={studentReportYear}
        studentReportResults={_.flattenDeep(Object.values(studentReportResultMap))}
     />

      <AttitudeAndManagementDiv results={resultList} />
      <LearningAgencyDiv results={resultList} />
      <ApproachesToLearningDiv results={resultList} />
      <ReflectionDiv results={resultList} />

      <CoCurricularActivitiesDiv student={student} studentReportYear={studentReportYear} />
      <AwardsDiv student={student} studentReportYear={studentReportYear} />

      <CommentsDiv result={resultList[0]} title={'Student as a Learner'}/>

      <TeachersDiv
        results={resultList}
        showHeadOfSchool={true}
        showHeadOfYear={true}
        teacherTitle={'Home Group Teacher'}
      />
    </SubjectPageWrapper>
  )
};

export default JnrGraphHomeGroupPage;
