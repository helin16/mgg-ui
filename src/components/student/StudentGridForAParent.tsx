import React, {useEffect, useState} from 'react';
import iVStudent, {iVPastAndCurrentStudent} from '../../types/Synergetic/Student/iVStudent';
import StudentContactService from '../../services/Synergetic/Student/StudentContactService';
import {STUDENT_CONTACT_TYPE_SC1} from '../../types/Synergetic/Student/iStudentContact';
import {Image, Spinner} from 'react-bootstrap';
import SynCommunityService from '../../services/Synergetic/Community/SynCommunityService';
import {OP_OR} from '../../helper/ServiceHelper';
import * as _ from 'lodash';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import styled from 'styled-components';
import StudentStatusBadge from '../../pages/studentReport/components/AcademicReports/StudentStatusBadge';
import {FlexContainer} from '../../styles';
import ContactSupportPopupBtn from '../support/ContactSupportPopupBtn';
import PageNotFound from '../PageNotFound';

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
  contactTypes?: string[];
};
const StudentGridForAParent = ({
    parentSynId, onSelect, contactTypes = [STUDENT_CONTACT_TYPE_SC1]
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
    SynCommunityService.getCommunityProfiles({
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
        ContactType: contactTypes,
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
  }, [parentIds, contactTypes]);

  useEffect(() => {
    let isCancelled = false;
    if (studentIds.length <= 0) { return }

    setIsLoadingStudents(true);
    Promise.all(studentIds.map(studentId => {
        return SynVStudentService.getVPastAndCurrentStudentAll({
          where: JSON.stringify({StudentId: studentId}),
          perPage: 1,
          sort: 'FileYear:DESC,FileSemester:DESC'
        })
      }))
      .then(resp => {
        if (isCancelled === true) { return }
        const studentsMap = resp.reduce(
          (map: { [key: number]: iVPastAndCurrentStudent }, res) => {
            const arr = res.data || [];
            return {
              ...map,
              ...(arr.length <= 0 ? {} : {[arr[0].StudentID]: arr[0]}),
            }
          },
          {}
        );
        setStudents(Object.values(studentsMap));
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
        <Image src={student.profileUrl} className={'profile-img'}/>
        <div className={'title-div'}>
          <div><b>{student.StudentGiven1} {student.StudentSurname}</b></div>
          <div>{student.StudentFormHomeRoom} ({student.StudentID})</div>
          <StudentStatusBadge student={student} />
        </div>
      </div>
    )
  }

  if (isLoadingCommunity === true || isLoadingContacts === true || isLoadingStudents === true) {
    return <Spinner animation={'border'} size={'sm'}/>
  }

  if (students.length <= 0) {
    return <PageNotFound
      title={`Oops, we can NOT find your daughter(s)' profile.`}
      description={
        <span>
              Sorry we can't find your daughter(s)' profile. <br />
              If you believe there is an issue, please report this to the
              School.<br />
              If she is a student left the school, please click on "Report this issue" button,
              we will email you a copy of her report.
            </span>
      }
      secondaryBtn={
        <ContactSupportPopupBtn variant="link">
          Report this issue
        </ContactSupportPopupBtn>
      }
    />
  }

  return (
    <Wrapper>
      <h4>Please select one of your daughter's profile below: </h4>
      <FlexContainer className={'flex-wrap wrap'}>
        {students.map(student => getStudentProfileDiv(student))}
      </FlexContainer>
    </Wrapper>
  );
};

export default StudentGridForAParent;
