import iVStudent from '../../../../../types/Synergetic/Student/iVStudent';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/makeReduxStore';
import {useEffect, useState} from 'react';
import SBSubmissionReturnService from '../../../../../services/SchoolBox/SBSubmissionReturnService';
import {Spinner} from 'react-bootstrap';
import MathHelper from '../../../../../helper/MathHelper';
import {OP_AND, OP_GTE, OP_LT, OP_NOT} from '../../../../../helper/ServiceHelper';
import SBSubmissionGradeService from '../../../../../services/SchoolBox/SBSubmissionGradeService';
import iSBSubmissionGrade from '../../../../../types/SchoolBox/iSBSubmissionGrade';
import styled from 'styled-components';
import iSBSubmissionReturn from '../../../../../types/SchoolBox/iSBSubmissionReturn';
import AssessmentSubjectChart from './AssessmentSubjectChart';
import {Row, Col} from 'react-bootstrap';

type iAssessmentSubjectCharts = {
  student: iVStudent
}

const Wrapper = styled.div``;
const colors = ['#C13D01', '#11356B', '#3182B9', '#0E8131', '#FA7F0F', '#700f74', '#B90d19'];

export type iGradeMap = {
  [key: string]: {lower: number; higher: number};
}
const getGradeMap = (grades: iSBSubmissionGrade[]): iGradeMap => {
  const map = {};
  let lastMax = 99999;
  grades
    .sort((grade1, grade2) => grade1.lower_bound > grade2.lower_bound ? -1 : 1)
    .map(grade => {
      if (!(grade.caption in map)) {
        // @ts-ignore
        map[grade.caption] = { lower: grade.lower_bound, higher: lastMax };
        lastMax = grade.lower_bound;
      }
      return null;
    })
  return map;
}
export type iSubmissionReturnsMap = {
  [key: number]: iSBSubmissionReturn[];
}
const getSubmissionReturnMap = (submissionReturns: iSBSubmissionReturn[]): iSubmissionReturnsMap => {
  return submissionReturns.reduce((map, submissionReturn) => {
    const key = `${submissionReturn.SubmissionBox?.Folder?.name || ''}`;
    return {
      ...map,
      [key]:
        !(key in map) ?
          [submissionReturn] :
          // @ts-ignore
          [...map[key], ...[submissionReturn]],
    }
  }, {})
}


const AssessmentSubjectCharts = ({student}: iAssessmentSubjectCharts) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFileYear, setCurrentFileYear] = useState<number | null>(null);
  const [gradeMap, setGradeMap] = useState<iGradeMap>({});
  const [submissionReturnsMap, setSubmissionReturnsMap] = useState<iSubmissionReturnsMap>({});

  useEffect(() => {
    if(!user || !user?.SynCurrentFileSemester || !user?.SynCurrentFileSemester?.FileYear) {
      return
    }
    setCurrentFileYear(Number(user?.SynCurrentFileSemester?.FileYear));
  }, [user]);


  useEffect(() => {
    let isCancelled = false;
    if(currentFileYear === null) {
      return
    }
    setIsLoading(true);
    Promise.all([
      SBSubmissionGradeService.getSubmissionGrades({
        perPage: '999999',
        where: JSON.stringify({
          submission_grade_group_id: 1,
          deleted_at: null
        }),
      }),
      SBSubmissionReturnService.getSubmissionReturns({
        include: 'Owner,SubmissionBox.Folder',
        perPage: '999999',
        where: JSON.stringify({
          '$Owner.synergy_id$': student.StudentID,
          deleted_at: null,
          published_at: {[OP_NOT]: null},
          norm_mark: {[OP_NOT]: null},
          [OP_AND]: [
            {updated_at: {[OP_GTE]: `${currentFileYear}`}},
            {updated_at: {[OP_LT]: `${MathHelper.add(currentFileYear, 1)}`}},
          ]
        }),
      }),
    ])
    .then(res => {
      if (isCancelled === true) { return }
      setGradeMap(getGradeMap(res[0].data));
      setSubmissionReturnsMap(getSubmissionReturnMap(res[1].data));
    })
    .finally(() => {
      setIsLoading(false)
    });

    return () => {
      isCancelled = true;
    }
  }, [currentFileYear, student]);


  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }
  return (
    <Wrapper>
      <div className={'text-center'}><b>{currentFileYear} Assessment Grades</b></div>
      <Row className={'graphs-wrapper'}>
        {Object.values(submissionReturnsMap).map((submissionReturnsMapRow, index) => {
          return (
            <Col key={index} md={6} lg={4}>
              <AssessmentSubjectChart

                submissionReturns={submissionReturnsMapRow}
                gradeMap={gradeMap}
                colorCode={colors[index]}
              />
            </Col>
          );
        })}
      </Row>
    </Wrapper>
  );
}

export default AssessmentSubjectCharts;
