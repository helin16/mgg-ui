import ModuleUserList from '../../../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import BTExceptionUserList from './BTExceptionUserList';

const Wrapper = styled.div``;
const BTUserAdminPanel = () => {
  return (
    <Wrapper>
      <div className={'panel-wrapper space-below'}>
        <h6>Admin Users:</h6>
        <ExplanationPanel text={'Admin users for Budget Tracker'} />
        <ModuleUserList
          moduleId={MGGS_MODULE_ID_BUDGET_TRACKER}
          roleId={ROLE_ID_ADMIN}
          showCreatingPanel
          showDeletingBtn
        />
      </div>
      <div className={'panel-wrapper space-below'}>
        <h6>Exception Users:</h6>
        <ExplanationPanel text={'Exception users can add budget items even when the budget year is locked down. Each carries an expiry date and is deactivated automatically once it passes.'} />
        <BTExceptionUserList />
      </div>
    </Wrapper>
  )
}

export default BTUserAdminPanel;
