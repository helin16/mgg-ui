import {Button} from 'react-bootstrap';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  MGGS_MODULE_ID_FUNNEL,
} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import FunnelModuleEditPanel from './components/FunnelModuleEditPanel';
import FunnelDownloadLatestPopupBtn from './components/FunnelDownloadLatestPopupBtn';
import MathHelper from '../../helper/MathHelper';
import MessageListPanel from '../../components/common/MessageListPanel';
import {MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST} from '../../types/Message/iMessage';
import ExplanationPanel from '../../components/ExplanationPanel';

type iFunnelAdminPage = {
  onRedirectBack: () => void;
}
const Wrapper = styled.div`
`;
const FunnelAdminPage = ({onRedirectBack}: iFunnelAdminPage) => {
  const [count, setCount] = useState(0);

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

        <div className={'section-row'}>
          <h5>Sync down</h5>
          <ExplanationPanel
            text={<span>This is for Funnel(https://mggs-au-vic-254.app.digistorm.com/) Data Sync. Funnel Data will be sync down every hour. <b>THE RESULT OF THIS WILL AFFECT THE POWER BI DASHBOARD</b></span>}
          />
          <FunnelDownloadLatestPopupBtn onSubmitted={() => setCount(MathHelper.add(count, 1))}/>
          <MessageListPanel type={MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST} reloadCount={count} />
        </div>
      </>
    )
  }

  return (
    <ModuleAccessWrapper
      moduleId={MGGS_MODULE_ID_FUNNEL}
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
