import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import iVStudent from '../../../types/Synergetic/Student/iVStudent';
import SBUserService from '../../../services/SchoolBox/SBUserService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import Page401 from '../../../components/Page401';
import StudentDetailsPage from './StudentDetailsPage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import StudentContactService from '../../../services/Synergetic/Student/StudentContactService';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import {OP_OR} from '../../../helper/ServiceHelper';
import {STUDENT_CONTACT_TYPE_SC1} from '../../../types/Synergetic/Student/iStudentContact';

const Wrapper = styled.div``;

type iAcademicReportsForSchoolBoxId = {
  schoolBoxId: string;
}
const AcademicReportsForSchoolBoxId = ({schoolBoxId}: iAcademicReportsForSchoolBoxId) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const currentUserSynId = `${user?.synergyId || ''}`.trim();
    if (currentUserSynId === '' || (user?.isStaff !== true && user?.isParent !== true && user?.isStudent !== true)) {
      return;
    }

    let isCanceled = false;

    const getData = async () => {
      const result = await SBUserService.getAll({
        where: JSON.stringify({id: schoolBoxId}),
        perPage: 1,
      });
      const sbUsers = (result.data || []);
      const sbUser = sbUsers.length > 0 ? sbUsers[0] : null;
      if (!sbUser) {
        return;
      }

      const students = (await SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({ID: sbUser.synergy_id})
      })).data || [];
      const student = students.length > 0 ? students[0] : null;

      // if the current user is a student and not the selected student, then not showing.
      if(user?.isStudent === true && student?.ID !== user.synergyId && `${student?.ID || ''}`.trim() !== '') {
        if (isCanceled) { return }
        setErrorMsg(`You can't access someone else' report.`);
        return;
      }

      // if the current user is a student and not the selected student, then not showing.
      if(user?.isParent === true && `${student?.ID || ''}`.trim() !== '') {
        const resp = await SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ [OP_OR]: [ {SpouseID: currentUserSynId}, {ID: currentUserSynId} ] })
        });
        const parentIds: number[] = [];
        resp.data.forEach(community => { // @ts-ignore
          parentIds.push(Number(community.ID));
          parentIds.push(Number(community.SpouseID));
        });
        const parents = (await StudentContactService.getStudentContacts({
          where: JSON.stringify({
            ID: `${student?.ID || ''}`.trim(),
            LinkedID: parentIds,
            ContactType: [STUDENT_CONTACT_TYPE_SC1],
          }),
        })).data || [];

        if (parents.length <= 0) {
          if (isCanceled) { return }
          setErrorMsg(`You don't access her report.`);
          return;
        }
      }

      if (isCanceled) { return }
      setSelectedStudent(student);
    }

    setIsLoading(true);
    getData().catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [schoolBoxId, user]);

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    if (selectedStudent) {
      return <StudentDetailsPage student={selectedStudent} />
    }

    return <Page401 description={errorMsg || ''}/>;
  }

  return (
    <Wrapper>{getContent()}</Wrapper>
  )
}

export default AcademicReportsForSchoolBoxId;
