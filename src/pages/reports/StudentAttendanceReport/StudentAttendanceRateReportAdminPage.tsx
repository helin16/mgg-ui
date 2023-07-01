import {FlexContainer} from '../../../styles';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import SectionDiv from '../../../components/common/SectionDiv';
import ExplanationPanel from '../../../components/ExplanationPanel';
import ModuleUserList from '../../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../../types/modules/iRole';
import SchoolManagementTable from '../../../components/SchoolManagement/SchoolManagementTable';
import React from 'react';
import {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from '../../../types/Synergetic/iSchoolManagementTeam';

type iStudentAttendanceRateReportAdminPage = {
  onNavBack: () => void;
}


export const canAccessModuleSMTRoleCodes = [SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR, SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL, SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL];
const StudentAttendanceRateReportAdminPage = ({onNavBack}: iStudentAttendanceRateReportAdminPage) => {
  return (
    <>
      <FlexContainer className={'with-gap space-below'}>
        <Button variant={'link'} size={'sm'} onClick={() => onNavBack()}>
          <Icons.ArrowLeft />
        </Button>
        <h3>Student Attendance Rate Report - Admin </h3>
      </FlexContainer>

      <SectionDiv>
        <h5>Users</h5>
        <ExplanationPanel text={'all users below, head of years and head of schools can access this module'} />
        <ModuleUserList moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE} roleId={ROLE_ID_NORMAL} showCreatingPanel />
        <SectionDiv>
          <h6>Head Of Years / Head of Schools</h6>
          <SchoolManagementTable viewOnly={true} showExplanation={false} showSearchPanel={false} roleCodes={canAccessModuleSMTRoleCodes}/>
        </SectionDiv>
      </SectionDiv>

      <SectionDiv>
        <h5>Admin Users</h5>
        <ExplanationPanel text={'Managing this module'} />
        <ModuleUserList moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE} roleId={ROLE_ID_ADMIN} showCreatingPanel />
      </SectionDiv>
    </>
  )
}

export default StudentAttendanceRateReportAdminPage;
