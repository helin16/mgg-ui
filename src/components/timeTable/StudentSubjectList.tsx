import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import SynTimeTableService from '../../services/Synergetic/SynTimeTableService';
import Toaster from '../../services/Toaster';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import Table, {iTableColumn} from '../common/Table';
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import {iVPastAndCurrentStudent} from '../../types/Synergetic/Student/iVStudent';
import Page401 from '../Page401';
import SynVStudentContactAllAddressService from '../../services/Synergetic/Student/SynVStudentContactAllAddressService';
import {OP_OR} from '../../helper/ServiceHelper';
import {STUDENT_CONTACT_TYPE_SC1} from '../../types/Synergetic/Student/iStudentContact';

const Wrapper = styled.div``
type iStudentSubjectList = {
  className?: string;
  studentSynId: string | number;
}
const StudentSubjectList = ({className, studentSynId}: iStudentSubjectList) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const studentSynIdStr = `${studentSynId || ''}`.trim();
  const currentUserSynId = `${currentUser?.synergyId || ''}`.trim();
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [fileYear, setFileYear] = useState<string>('');
  const [fileSemester, setFileSemester] = useState<string>('');
  const [currentStudent, setCurrentStudent] = useState<iVPastAndCurrentStudent | null>(null);
  const [currentUserIsParent, setCurrentUserIsParent] = useState(false);

  useEffect(() => {
    if (currentUserSynId === '') {
      setCurrentStudent(null);
      setFileYear('');
      setFileSemester('');
      setSubjects([]);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    Promise.all([
      SynTimeTableService.getStudentSubjects(studentSynIdStr),
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          StudentID: studentSynIdStr,
        }),
        perPage: 1,
      }),
      SynVStudentContactAllAddressService.getAll({
        where: JSON.stringify({
          StudentID: studentSynIdStr,
          StudentContactType: [STUDENT_CONTACT_TYPE_SC1],
          [OP_OR]: [
            { StudentContactID: currentUserSynId },
            { StudentContactSpouseID: currentUserSynId },
          ]
        }),
        perPage: 1,
      })
    ])
      .then(([ttResult, studentResult, relationResult]) => {
        if (isCancelled) { return }
        const students = studentResult.data || [];
        setFileYear(ttResult.FileYear || '');
        setFileSemester(ttResult.FileSemester || '');
        setSubjects(
          (ttResult.Classes || [])
            .reduce((arr: string[], classInfo: {Class?: { SubjectName: string }}) => [...arr, classInfo.Class?.SubjectName], [])
            .filter((subjectName: string) => {
              const subjName = `${subjectName || ''}`.toLowerCase();
              return subjName.indexOf('assembly') < 0 && subjName.indexOf('house') < 0 && subjName.indexOf('tutor group') < 0 && subjName.indexOf('gsv') < 0
            })
        );
        setCurrentStudent(students.length > 0 ? students[0] : null);
        setCurrentUserIsParent((relationResult.data || []).length > 0)
      })
      .catch(err=> {
        if (isCancelled) { return }
        console.error(err);
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) { return }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [studentSynIdStr, currentUserSynId]);

  const getList = () => {
    return (
      <>
        <h3>Subjects for <u><i>{currentStudent?.StudentNameInternal}</i></u> - Semester {fileSemester}, {fileYear}</h3>
        <Table
          hover
          striped
          columns={[
            {
              key: 'subject',
              header: 'Subject',
              cell: (column: iTableColumn<string>, data?: string) => {
                return <td key={column.key}>{data || ''}</td>
              }
            },
          ]} rows={subjects.sort()} />
      </>
    )
  }

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }
    if (currentUserSynId === studentSynIdStr || currentUser?.isStaff === true || (currentUser?.isParent === true && currentUserIsParent === true)) {
      return getList();
    }
    return <Page401 description={<>Sorry, you don't have access to this page.</>} />
  }

  return (
    <Wrapper className={`${StudentSubjectList.name} ${className || ''}`}>
      {getContent()}
    </Wrapper>
  )
}

export default StudentSubjectList;
