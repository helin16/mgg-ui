import {useEffect, useState} from 'react';
import iVStudent from '../../types/Synergetic/iVStudent';
import StudentContactService from '../../services/Synergetic/StudentContactService';
import {STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2, STUDENT_CONTACT_TYPE_SC3} from '../../types/Synergetic/iStudentContact';
import {Image, Spinner} from 'react-bootstrap';
import CommunityService from '../../services/Synergetic/CommunityService';
import {OP_OR} from '../../helper/ServiceHelper';
import * as _ from 'lodash';
import VStudentService from '../../services/Synergetic/VStudentService';
import styled from 'styled-components';

const Wrapper = styled.div`
  .student-div {
    text-align: center;
    width: 250px;
    padding: 10px;
    margin: 10px 0px;
    display: inline-block;
    
    :hover {
      border: 1px solid #ccc;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 3px 3px 20px 2px #dedede;
    }
    
    .title-div {
      padding: 10px;
    }
  }
`

type iStudentGridForAParent = {
  parentSynId: string | number;
  onSelect?: (student: iVStudent) => void;
};
const StudentGridForAParent = ({
    parentSynId, onSelect
 }: iStudentGridForAParent) => {
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [parentIds, setParentIds] = useState<number[]>([]);
  const [studentIds, setStudentIds] = useState<number[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!parentSynId) { return; }
    setIsLoadingCommunity(true);
    CommunityService.getCommunityProfiles({
        where: JSON.stringify({ [OP_OR]: [ {SpouseID: parentSynId}, {ID: parentSynId} ] })
      })
      .then(resp => {
        if (isCancelled) { return }
        const parentIds: number[] = [];
        resp.data.map(community => { // @ts-ignore
          parentIds.push(Number(community.ID)); parentIds.push(Number(community.SpouseID));
          return null;
        });
        setParentIds(_.uniq(parentIds));
      })
      .finally(() => {
        setIsLoadingCommunity(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [parentSynId]);

  useEffect(() => {
    let isCancelled = false;
    if (parentIds.length <= 0) { return }

    setIsLoadingContacts(true);
    StudentContactService.getStudentContacts({
      where: JSON.stringify({
        LinkedID: parentIds,
        ContactType: [STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2, STUDENT_CONTACT_TYPE_SC3],
      }),
    })
      .then(res => {
        if (isCancelled) { return }
        setStudentIds(_.uniq(res.data.map(studentContact => studentContact.ID )))
      })
      .finally(() => {
        setIsLoadingContacts(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [parentIds]);

  useEffect(() => {
    let isCancelled = false;
    if (studentIds.length <= 0) { return }

    setIsLoadingStudents(true);
    Promise.all(studentIds.map(studentId => {
        return VStudentService.getCurrentVStudent(studentId)
      }))
      .then(resp => {
        if (isCancelled === true) { return }
        setStudents(resp);
      })
      .finally(() => {
        setIsLoadingStudents(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [studentIds]);

  const getStudentProfileDiv = (student: iVStudent) => {
    return (
      <div className={'student-div'} key={student.StudentID} onClick={() => onSelect && onSelect(student)}>
        <Image src={student.profileUrl} />
        <div className={'title-div'}>
          <div><b>{student.StudentGiven1} {student.StudentSurname}</b></div>
          <div>{student.StudentFormHomeRoom} ({student.StudentID})</div>
        </div>
      </div>
    )
  }

  if (isLoadingCommunity === true || isLoadingContacts === true || isLoadingStudents === true) {
    return <Spinner animation={'border'} />
  }

  return (
    <Wrapper>
      {students.map(student => getStudentProfileDiv(student))}
    </Wrapper>
  );
};

export default StudentGridForAParent;
