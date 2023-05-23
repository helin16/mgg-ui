import {Button, Tab, Tabs} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ExplanationPanel from '../../components/ExplanationPanel';
import SectionDiv from '../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import {useState} from 'react';
import SchoolManagementTable from '../../components/SchoolManagement/SchoolManagementTable';
import {SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR} from '../../types/Synergetic/iSchoolManagementTeam';

type iStudentAbsenceAdminPage = {
  onNavBack: () => void;
}

const TAB_USERS = 'users';
const TAB_ADMIN_USERS = 'admin_users';
const StudentAbsenceAdminPage = ({onNavBack}: iStudentAbsenceAdminPage) => {
  const [showingType, SetShowingType] = useState(TAB_USERS);

  return (
    <div>
      <h3>
        <Button onClick={() => onNavBack()} variant={'link'}>
          <Icons.ArrowLeft />
        </Button>
        {' '}
        Student Absence Admin
      </h3>

      <Tabs
        activeKey={showingType}
        onSelect={(name) => SetShowingType(name || TAB_USERS)}
      >
        <Tab
          title={'Users'}
          eventKey={TAB_USERS}
          unmountOnExit
        >
          <SectionDiv>
            <ExplanationPanel
              text={
                <>
                  Normal users will receive notifications when an absence submitted or updated.
                  <div><b>All Head of Years will be included into normal users automatically. but they will only operate on the same year level of the student</b></div>
                </>
              }
            />
          </SectionDiv>
          <SectionDiv>
            <h5>Users</h5>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
              roleId={ROLE_ID_NORMAL}
              showCreatingPanel
            />
          </SectionDiv>
          <SectionDiv>
            <h5>Head Of Years</h5>
            <SchoolManagementTable roleCodes={[SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR]} viewOnly showExplanation={false} showSearchPanel={false}/>
          </SectionDiv>
        </Tab>
        <Tab
          title={'Admin Users'}
          eventKey={TAB_ADMIN_USERS}
          unmountOnExit
        >
          <SectionDiv>
            <ExplanationPanel text={'Admin users will not receive notifications when an absence submitted or updated. Admin users is designed to config this module'} />
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
              roleId={ROLE_ID_ADMIN}
              showCreatingPanel
            />
          </SectionDiv>
        </Tab>
      </Tabs>
    </div>
  )
}

export default StudentAbsenceAdminPage;
