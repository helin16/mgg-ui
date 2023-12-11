import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import iVStudent from '../../../types/Synergetic/Student/iVStudent';
import SBUserService from '../../../services/SchoolBox/SBUserService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import Page401 from '../../../components/Page401';
import StudentDetailsPage from './StudentDetailsPage';

const Wrapper = styled.div``;

type iAcademicReportsForSchoolBoxId = {
  schoolBoxId: string;
}
const AcademicReportsForSchoolBoxId = ({schoolBoxId}: iAcademicReportsForSchoolBoxId) => {

  const [student, setStudent] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
      setStudent(students.length > 0 ? students[0] : null)
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
  }, [schoolBoxId]);

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }
    if (student) {
      return <StudentDetailsPage
        student={student}
        showTitle={false}
      />
    }
    return <Page401 />;
  }

  return (
    <Wrapper>{getContent()}</Wrapper>
  )
}

export default AcademicReportsForSchoolBoxId;
