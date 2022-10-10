import React, {useState} from 'react';
import MessageListPanel from '../../../components/common/MessageListPanel';
import {MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER} from '../../../types/Message/iMessage';
import OperooSafetyAlertDownloadPopupBtn from './OperooSafetyAlertDownloadPopupBtn';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const ACTION_DOWNLOAD = 'DOWNLOAD';
const ACTION_LOG = 'LOGS';

const Wrapper = styled.div`
  .content-wrapper {
    padding: 0.6rem;
  }
`;

const OperooDownloadPanel = () => {

  const [action, setAction] = useState(ACTION_DOWNLOAD);

  const getBtnClassName = (expect: string) => {
    if (action === expect) {
      return 'primary'
    }
    return 'secondary'
  }

  const getContent = () => {
    switch (action) {
      case ACTION_DOWNLOAD: {
        return (
          <>
            <p>Clicking the button below will force system to re-download All Safety Alerts from Operoo Now.</p>
            <OperooSafetyAlertDownloadPopupBtn />
          </>
        )
      }
      case ACTION_LOG: {
        return (
          <MessageListPanel type={MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER} />
        )
      }
      default: {
        return null;
      }
    }
  }

  return (
    <Wrapper>
      <ButtonGroup>
        <Button variant={getBtnClassName(ACTION_DOWNLOAD)} onClick={() => setAction(ACTION_DOWNLOAD)}>Download</Button>
        <Button variant={getBtnClassName(ACTION_LOG)} onClick={() => setAction(ACTION_LOG)}>Logs</Button>
      </ButtonGroup>
      <div className={'content-wrapper'}>
        {getContent()}
      </div>
    </Wrapper>
  )
}

export default OperooDownloadPanel;
