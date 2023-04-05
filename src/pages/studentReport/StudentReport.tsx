import React, {useEffect, useState} from 'react';
import SearchPage from './components/SearchPage';
import iVStudent from '../../types/Synergetic/iVStudent';
import StudentDetailsPage from './components/StudentDetailsPage';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import SynVStudentService from '../../services/Synergetic/SynVStudentService';
import {Button} from 'react-bootstrap';
import Page401 from '../../components/Page401';
import StudentGridForAParent from '../../components/student/StudentGridForAParent';
import AuthService from '../../services/AuthService';
import {MGGS_MODULE_ID_STUDENT_REPORT} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import PageNotFound from '../../components/PageNotFound';
import ContactSupportPopupBtn from '../../components/support/ContactSupportPopupBtn';
import Page from '../../layouts/Page';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';

const StudentReport = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!user || user?.isStudent !== true) {
      return;
    }
    setIsLoading(true);
    SynVStudentService.getCurrentVStudent(user?.synergyId)
      .then(resp => {
        if (isCancelled) { return }
        setSelectedStudent(resp);
      })
      .finally(() => {
        if (isCancelled) { return }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    }
  }, [user])

  useEffect(() => {
    if (!user || user?.isStaff !== true) { return }
    let isCancelled = false;
    setIsLoading(true);
    AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_REPORT)
      .then(resp => {
        if (isCancelled === true) { return }
        setIsAdminUser(Object.keys(resp).filter(roleId => `${roleId}` === `${ROLE_ID_ADMIN}`).length > 0)
      })
      .finally(() => {
        if (isCancelled) { return }
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [user])

  if (!user) {
    return null;
  }

  if (isLoading === true) {
    return (<PageLoadingSpinner />);
  }

  const getMainPage = () => {
    if (selectedStudent) {
      return <StudentDetailsPage student={selectedStudent} onClearSelectedStudent={() => setSelectedStudent(null)}/>;
    }
    if (user?.isParent === true) {
      return <StudentGridForAParent parentSynId={user?.synergyId} onSelect={(student) => setSelectedStudent(student)}/>;
    }
    if (user?.isTeacher === true || isAdminUser === true) {
      return <SearchPage onSelect={(student) => setSelectedStudent(student)}/>;
    }
    if (user?.isStudent === true && !selectedStudent) {
      return <PageNotFound
        title={`Opps, we can NOT find your profile.`}
        description={
          <span>
            Sorry we can't find your profile as a current student. <br />
            This may be caused by your session timed out, please try to refresh this page to reconnect <br />
            If you believe there is an issue, please report this to the School.
          </span>
        }
        secondaryBtn={
          <ContactSupportPopupBtn>
            <Button variant="link">Report this issue</Button>
          </ContactSupportPopupBtn>
        }
      />
    }

    return <Page401 />;
  }

  return (
    <Page className={'student-report-wrapper'}>
      {getMainPage()}
    </Page>
  )
};

export default StudentReport;
