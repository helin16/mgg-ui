import iVStudent from '../../../../../types/student/iVStudent';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/makeReduxStore';
import {useEffect, useState} from 'react';
import iSBSubmissionReturn from '../../../../../types/SBSubmission/iSBSubmissionReturn';
import SBSubmissionReturnService from '../../../../../services/SchoolBox/SBSubmissionReturnService';
import {Spinner} from 'react-bootstrap';
import MathHelper from '../../../../../helper/MathHelper';
import {OP_AND, OP_GTE, OP_LIKE, OP_LT} from '../../../../../helper/ServiceHelper';

type iAssessmentAlertGraph = {
  student: iVStudent
}

const getAlertMap = (submissionReturns: iSBSubmissionReturn[]) => {
  const map = {};
  submissionReturns.map(submissionReturn => {
    const mark = `${submissionReturn.mark || ''}`.trim();
    if (mark === '') {
      return;
    }
    let key = '';
    switch (mark.toLowerCase()) {
      case 'Not Assessed'.toLowerCase():
      case 'Not Satisfactory'.toLowerCase():
      case 'Absent'.toLowerCase():
      case 'Not Submitted'.toLowerCase(): {
        key = mark;
        break;
      }
      default: {
        key = 'Submitted'
      }
    }
    if (!(key in map)) {
      // @ts-ignore
      map[key] = 0;
    }
    // @ts-ignore
    map[key] = MathHelper.add(map[key], 1);
  })
  return map;
}

const AssessmentAlertGraph = ({student}: iAssessmentAlertGraph) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [submissionReturnsMap, setSubmissionReturnsMap] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = true;
    setIsLoading(true);

    SBSubmissionReturnService.getSubmissionReturns({
        include: 'Owner',
        perPage: '999999',
        where: JSON.stringify({
          '$Owner.synergy_id$': student.StudentID,
          deleted_at: null,
          ...(user?.SynCurrentFileSemester && user?.SynCurrentFileSemester.FileYear ? {
            [OP_AND]: [
              {updated_at: {[OP_GTE]: `${user?.SynCurrentFileSemester.FileYear}`}},
              {updated_at: {[OP_LT]: `${MathHelper.add(user?.SynCurrentFileSemester.FileYear, 1)}`}},
            ]
          } : {})
        }),
      })
      .then(res => {
        setSubmissionReturnsMap(getAlertMap(res.data));
      })
      .finally(() => {
        setIsLoading(false)
      })
    return () => {
      isCancelled = true;
    }
  }, [user, student]);


  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  return <div><b>{user?.SynCurrentFileSemester?.FileYear} Assessment Alerts</b></div>;
}

export default AssessmentAlertGraph;
