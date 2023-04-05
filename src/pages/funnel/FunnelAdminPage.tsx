import {Button} from 'react-bootstrap';
import React from 'react';
import styled from 'styled-components';
import {
  MGGS_MODULE_ID_BUDGET_TRACKER,
  MGGS_MODULE_ID_FUNNEL,
} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import FunnelModuleEditPanel from './components/FunnelModuleEditPanel';

type iFunnelAdminPage = {
  onRedirectBack: () => void;
}
const Wrapper = styled.div`
`;
const FunnelAdminPage = ({onRedirectBack}: iFunnelAdminPage) => {

  const getBackToListBtn = () => {
    return (
      <Button variant={'danger'} size={'sm'} onClick={() => onRedirectBack()}>
        <Icons.ArrowLeft /> Back
      </Button>
    )
  }

  const getContent = () => {
    return (
      <>
        <h3>
          Funnel Module Admin
          <Button
            size={'sm'}
            className={'float-right'}
            variant={'outline-secondary'}
            onClick={() => onRedirectBack()}>
            <Icons.ArrowLeft /> Back
          </Button>
        </h3>

        <div className={'section-row'}>
          <h5>Users</h5>
          <small>List of users who can access this module.</small>
          <ModuleUserList moduleId={MGGS_MODULE_ID_FUNNEL} roleId={ROLE_ID_NORMAL} showCreatingPanel={true} showDeletingBtn={true}/>
        </div>

        <div className={'section-row'}>
          <h5>Admin Users</h5>
          <small>List of users who can access this module. They can create users and change module settings</small>
          <ModuleUserList moduleId={MGGS_MODULE_ID_FUNNEL} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
        </div>

        <div className={'section-row'}>
          <h5>Module Settings</h5>
          <FunnelModuleEditPanel />
        </div>
      </>
    )
  }

  return (
    <ModuleAccessWrapper
      moduleId={MGGS_MODULE_ID_BUDGET_TRACKER}
      roleId={ROLE_ID_ADMIN}
      btns={getBackToListBtn()}
    >
      <Wrapper>
        {getContent()}
      </Wrapper>
    </ModuleAccessWrapper>
  )
}

export default FunnelAdminPage;
