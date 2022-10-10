import styled from 'styled-components';
import LoadingBtn from '../../../components/common/LoadingBtn';
import {useEffect, useState} from 'react';
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
const OperooSafetyAlertDownloadPopupBtn = () => {

  const [showingConfirmPanel, setShowingConfirmPanel] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<iMessage | null>(null);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({type: MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER}),
      sort: 'updatedAt:DESC',
      currentPage: '1',
      perPage: '1',
    }).then(resp => {
      if (isCanceled) return;
      setMessage(resp.data.length > 0 ? resp.data[0] : null)
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      setIsLoading(false);
    })
    return () => {
      isCanceled = true;
    }
  }, [])

  const handleClose = () => {
    if (isSaving) {
      return;
    }
    setShowingConfirmPanel(false);
  }

  const submit = () => {
    setIsSaving(true);
    OperooSafetyAlertService.downloadAlerts()
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
    if (getMessageIsWIP()) {
      return (
        <FlexContainer className={'withGap'}>
          <Spinner animation={'border'} size={'sm'}/>
          <div>Job started @ {moment(message?.createdAt).format('lll')}. Processing...</div>
        </FlexContainer>
      )
    }
    return (
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
        />
        <div>Send notifications to users when there are changes from Operoo</div>
      </FlexContainer>
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
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    return (
      <>
        <LoadingBtn variant={'danger'} isLoading={showingConfirmPanel} onClick={() => setShowingConfirmPanel(true)}>
          Force From Operoo Now
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
