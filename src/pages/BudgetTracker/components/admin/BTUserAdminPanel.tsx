import ModuleUserList from '../../../../components/module/ModuleUserList';
import {MODULE_ID_BUDGET_TRACKER} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';

const Wrapper = styled.div``;
const BTUserAdminPanel = () => {
  return (
    <Wrapper>
      <div className={'panel-wrapper space-below'}>
        <h6>Admin Users:</h6>
        <ExplanationPanel text={'Admin users for Budget Tracker'} />
        <ModuleUserList
          moduleId={MODULE_ID_BUDGET_TRACKER}
          roleId={ROLE_ID_ADMIN}
          showCreatingPanel
          showDeletingBtn
        />
      </div>
    </Wrapper>
  )
}

export default BTUserAdminPanel;
