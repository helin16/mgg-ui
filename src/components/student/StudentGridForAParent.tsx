import {useEffect, useState} from 'react';
import iVStudent from '../../types/student/iVStudent';
import StudentContactService from '../../services/Synergetic/StudentContactService';
import {STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2, STUDENT_CONTACT_TYPE_SC3} from '../../types/student/iStudentContact';
import {Spinner} from 'react-bootstrap';

type iStudentGridForAParent = {
  parentSynId: string | number;
  onSelect?: (student: iVStudent) => void;
};
const StudentGridForAParent = ({
    parentSynId, onSelect
 }: iStudentGridForAParent) => {
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!parentSynId) {
      return;
    }
    setIsLoading(true);
    const where = {
      LinkedID: parentSynId,
      // ContactType: [STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2, STUDENT_CONTACT_TYPE_SC3, ]
    };
    StudentContactService.getStudentContacts({
        where: JSON.stringify(where)
      })
      .then(resp => {
        console.log(resp);
        if (isCancelled) { return }
        // setSelectedStudent(resp);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [parentSynId]);

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  return null;
};

export default StudentGridForAParent;
