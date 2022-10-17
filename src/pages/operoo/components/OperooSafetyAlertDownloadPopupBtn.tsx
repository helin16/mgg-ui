import styled from 'styled-components';
import LoadingBtn from '../../../components/common/LoadingBtn';
import {useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import {Button, Form, Spinner} from 'react-bootstrap';
import {FlexContainer} from '../../../styles';
import OperooSafetyAlertService from '../../../services/Operoo/OperooSafetyAlertService';
import iMessage, {
  MESSAGE_STATUS_NEW,
  MESSAGE_STATUS_WIP,
  MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER
} from '../../../types/Message/iMessage';
import Toaster from '../../../services/Toaster';
import MessageService from '../../../services/MessageService';
import moment from 'moment-timezone';

const Wrapper = styled.div``
const PopupBodyWrapper = styled.div`
  .sendEmailNotification-switch {
    width: 32px;
    height: 10px;
    padding: 4px;
    input {
      position: relative;
      opacity: 1;
      width: 100%;
      height: 10px;
      margin: 0px;
    }
  }
`
const OperooSafetyAlertDownloadPopupBtn = () => {

  const [showingConfirmPanel, setShowingConfirmPanel] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<iMessage | null>(null);

  const getLatestMessage = () => {
    setShowingConfirmPanel(true);
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({type: MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER}),
      sort: 'updatedAt:DESC',
      currentPage: '1',
      perPage: '1',
    }).then(resp => {
      setMessage(resp.data.length > 0 ? resp.data[0] : null)
    }).catch(err => {
      Toaster.showApiError(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const handleClose = () => {
    if (isSaving) {
      return;
    }
    setShowingConfirmPanel(false);
  }

  const submit = () => {
    setIsSaving(true);
    OperooSafetyAlertService.downloadAlerts({sendEmailNotification})
      .then(resp => {
        setMessage(resp);
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsSaving(false);
    })
  }

  const getMessageIsWIP = () => {
    if (!message) {
      return false;
    }

    if ([MESSAGE_STATUS_NEW, MESSAGE_STATUS_WIP].indexOf(message?.status || '') >=0 ) {
      return true
    }

    return false;
  }

  const getPopupFooter = () => {
    if (getMessageIsWIP()) {
      return (
        <Button
          variant={'primary'}
          onClick={handleClose}>
          OK
        </Button>
      )
    }
    return (
      <>
        <LoadingBtn
          variant={'default'}
          isLoading={isSaving}
          onClick={handleClose}>
          Cancel
        </LoadingBtn>
        <LoadingBtn
          isLoading={isSaving}
          onClick={() => submit()}
          variant={'danger'}>
          Download Now
        </LoadingBtn>
      </>
    )
  }

  const getPopupBody = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    if (getMessageIsWIP()) {
      return (
        <div>
          <FlexContainer className={'withGap'}>
            <Spinner animation={'border'} size={'sm'} />
            <div>Processing</div>
          </FlexContainer>
          <div>There is a Job started @ <b>{moment(message?.createdAt).format('lll')}</b>. Please wait until it finishes before request a new one.</div>
        </div>
      )
    }
    return (
      <PopupBodyWrapper>
        <FlexContainer
          style={{cursor: 'pointer'}}
          onClick={() => setSendEmailNotification(!sendEmailNotification)}
        >
          <Form.Check
            disabled={isSaving}
            type="switch"
            checked={sendEmailNotification}
            label=""
            onChange={() => {}}
            className={'sendEmailNotification-switch'}
          />
          <div>Send notifications to users when there are changes from Operoo</div>
        </FlexContainer>
      </PopupBodyWrapper>
    )
  }


  const getPopup = () => {
    if (!showingConfirmPanel) {
      return null;
    }
    return (
      <PopupModal
        show={true}
        handleClose={handleClose}
        header={<b>Sync from Operoo Now</b>}
        footer={getPopupFooter()}
      >
        {getPopupBody()}
      </PopupModal>
    )
  }

  const getContent = () => {
    return (
      <>
        <LoadingBtn variant={'danger'} isLoading={showingConfirmPanel} onClick={() => getLatestMessage()}>
          Force Download Now
        </LoadingBtn>
        {getPopup()}
      </>
    )
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  )
}

export default OperooSafetyAlertDownloadPopupBtn;
