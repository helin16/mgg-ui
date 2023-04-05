import styled from 'styled-components';
import ExplanationPanel from '../../components/ExplanationPanel';
import React, {useState} from 'react';
import {
  MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST
} from '../../types/Message/iMessage';
import MessageListPanel from '../../components/common/MessageListPanel';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_FUNNEL} from '../../types/modules/iModuleUser';
import FunnelAdminPage from './FunnelAdminPage';
import FunnelDownloadLatestPopupBtn from './components/FunnelDownloadLatestPopupBtn';
import MathHelper from '../../helper/MathHelper';

const Wrapper = styled.div`
  .float-right {
    float: right;
  }
  .section-row {
    margin-bottom: 2rem;
  }
`;
const FunnelPage = () => {
  const [showingAdminPage, setShowingAdminPage] = useState(false);
  const [count, setCount] = useState(0);

  const getContent = () => {

    if (showingAdminPage === true) {
      return <FunnelAdminPage onRedirectBack={() => setShowingAdminPage(false)} />
    }

    return (
      <>
        <h3>
          Funnel
          <ModuleAdminBtn
            moduleId={MGGS_MODULE_ID_FUNNEL}
            className={'float-right'}
            onClick={() => setShowingAdminPage(true)}
          />
        </h3>
        <ExplanationPanel
          text={<span>This page is for Funnel(https://mggs-au-vic-254.app.digistorm.com/) Data Sync. Funnel Data will be sync down every hour. <b>THE RESULT OF THIS WILL AFFECT THE POWER BI DASHBOARD</b></span>}
        />

        <div className={'section-row'}>
          <FunnelDownloadLatestPopupBtn onSubmitted={() => setCount(MathHelper.add(count, 1))}/>
        </div>

        <div className={'section-row'}>
          <MessageListPanel type={MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST} reloadCount={count} />
        </div>
      </>
    )
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  );
}

export default FunnelPage;
