import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import {Button, Tab, Tabs} from 'react-bootstrap';
import {
  iRecordType,
  STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT,
  STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN
} from '../../types/StudentAbsence/iStudentAbsence';
import UnSyncdStudentAbsenceListPanel from './components/UnSyncdStudentAbsenceListPanel';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../types/modules/iModuleUser';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import StudentAbsenceAdminPage from './StudentAbsenceAdminPage';
import StudentAbsenceService from '../../services/StudentAbsences/StudentAbsenceService';
import StudentAbsenceCreatePage from './StudentAbsenceCreatePage';
import * as Icons from 'react-bootstrap-icons';
import {FlexContainer} from '../../styles';
import AuthService from '../../services/AuthService';
import Toaster from '../../services/Toaster';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import SchoolManagementTeamService from '../../services/Synergetic/SchoolManagementTeamService';
import {SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR} from '../../types/Synergetic/iSchoolManagementTeam';
import moment from 'moment-timezone';
import Page401 from '../../components/Page401';
import StudentScheduledAbsenceListPanel from './components/StudentScheduledAbsenceListPanel';

const Wrapper = styled.div`
  .tab-pane {
    padding: 1rem 0;
  }
`;

const TAB_EARLY_SIGN_OUT = STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT;
const TAB_LATE_SIGN_IN = STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN;
const TAB_SCHEDULED_EARLY_SIGN_OUT = `Scheduled ${STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT}`;
const TAB_SCHEDULED_LATE_SIGN_IN = `Scheduled ${STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN}`;

const StudentAbsencePage = () => {
  const [showingType, SetShowingType] = useState(TAB_EARLY_SIGN_OUT);
  const [showingAdminPage, setShowingAdminPage] = useState(false);
  const [showingCreationPage, setShowingCreationPage] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_ABSENCES),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          SSTStaffID: user?.synergyId || '',
          SchoolRoleCode: SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
          FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
          FileSemester: user?.SynCurrentFileSemester?.FileSemester || moment().year(),
        })
      })
    ])
      .then(resp => {
        if (isCanceled) return;
        // @ts-ignore
        const canAccessRoles = Object.keys(resp[0]).filter((roleId: number) => resp[0][roleId].canAccess === true).reduce((map, roleId) => {
          return {
            ...map,
            // @ts-ignore
            [roleId]: resp[0][roleId],
          }
        }, {});
        setCanAccess(Object.keys(canAccessRoles).length > 0 || resp[1].length > 0);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [user]);

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  if (!canAccess) {
    return <Page401 description={<h4>Please contact IT or Module Admins for assistant</h4>} />
  }

  if (showingCreationPage) {
    return <StudentAbsenceCreatePage onNavBack={() => setShowingCreationPage(false)} />;
  }

  if (showingAdminPage) {
    return <StudentAbsenceAdminPage onNavBack={() => setShowingAdminPage(false)} />;
  }


  return (
    <Wrapper>
      <h3>
        <span>
          {`${showingType}`.includes('Scheduled') ? 'Scheduled' : `UnSync'd`} 
          Student Absence(s):
          <u>{ StudentAbsenceService.getAbsenceTypeName(`${showingType}`.replace('Scheduled', '').trim() as iRecordType)}</u>
        </span>
        <FlexContainer className={'float-right with-gap'}>
          <Button variant={'link'} href={process.env.REACT_APP_MOBILE_APP_URL || ''} target={'_blank'}>
            <Icons.Link45deg />{' '}
            Student SignIn/SignOut App
          </Button>
          <Button
            variant={'primary'}
            onClick={() => setShowingCreationPage(true)}
            size={'sm'}
          >
            <Icons.Plus />{' '} New
          </Button>
          <ModuleAdminBtn
            moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
            onClick={() => setShowingAdminPage(true)}
          />
        </FlexContainer>
      </h3>

      <Tabs
        activeKey={showingType}
        onSelect={(name) => SetShowingType(name || TAB_EARLY_SIGN_OUT)}
        unmountOnExit
      >
        <Tab eventKey={TAB_EARLY_SIGN_OUT} title="Early Sign-outs">
          <UnSyncdStudentAbsenceListPanel type={STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT} />
        </Tab>
        <Tab eventKey={TAB_LATE_SIGN_IN} title="Late Sign-ins">
          <UnSyncdStudentAbsenceListPanel type={STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN} />
        </Tab>

        <Tab eventKey={TAB_SCHEDULED_EARLY_SIGN_OUT} title="Scheduled Early Sign-outs">
          <StudentScheduledAbsenceListPanel type={STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT} />
        </Tab>

        <Tab eventKey={TAB_SCHEDULED_LATE_SIGN_IN} title="Scheduled Late Sign-ins">
          <StudentScheduledAbsenceListPanel type={STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN} />
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export default StudentAbsencePage;
