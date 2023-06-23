import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_FINANCE} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import SectionDiv from '../../components/common/SectionDiv';
import FinanceAdminModuleSettings from './components/FinanceAdminModuleSettings';

type iFinanceAdminPage = {
  onNavBack: () => void;
}
const FinanceAdminPage = ({onNavBack}: iFinanceAdminPage) => {
  return (
    <>
      <h3>
        <Button variant={'link'} onClick={() => onNavBack()} size={'sm'}>
          <Icons.ArrowLeft />
        </Button> {' '}
        Finance Admin
      </h3>

      <SectionDiv>
        <h5>Users</h5>
        <ModuleUserList moduleId={MGGS_MODULE_ID_FINANCE} roleId={ROLE_ID_NORMAL} showCreatingPanel/>
      </SectionDiv>

      <SectionDiv>
        <h5>Admin Users</h5>
        <ModuleUserList moduleId={MGGS_MODULE_ID_FINANCE} roleId={ROLE_ID_ADMIN} showCreatingPanel/>
      </SectionDiv>

      <SectionDiv>
        <h5>Settings</h5>
        <FinanceAdminModuleSettings />
      </SectionDiv>
    </>
  )
}

export default FinanceAdminPage
