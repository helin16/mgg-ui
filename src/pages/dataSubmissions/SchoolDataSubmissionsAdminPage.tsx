import styled from 'styled-components';
import * as Icons from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import SectionDiv from '../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';

const Wrapper = styled.div``

type iSchoolDataSubmissionsAdminPage = {
  onNavBack: () => void;
}
const SchoolDataSubmissionsAdminPage = ({onNavBack}: iSchoolDataSubmissionsAdminPage) => {

  return (
    <Wrapper className={'school-data-submission-admin-page'}>
      <h3>
        <Button variant={'link'} onClick={() => onNavBack()}><Icons.ArrowLeft /></Button>{' '}
        School Data Submission - Admin
      </h3>

      <SectionDiv>
        <h5>Users</h5>
        <small>All users who can access this module</small>
        <ModuleUserList moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION} roleId={ROLE_ID_NORMAL} showCreatingPanel showDeletingBtn/>
      </SectionDiv>

      <SectionDiv>
        <h5>Admins</h5>
        <small>All users who can manage this module</small>
        <ModuleUserList moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION} roleId={ROLE_ID_ADMIN} showCreatingPanel showDeletingBtn/>
      </SectionDiv>
    </Wrapper>
  )
}

export default SchoolDataSubmissionsAdminPage;
