import styled from 'styled-components';
import LoadingBtn from '../../../components/common/LoadingBtn';
import {useState} from 'react';
import PopupModal from '../../../components/common/PopupModal';
import {Button, Spinner} from 'react-bootstrap';
import {FlexContainer} from '../../../styles';
import iMessage, {
  MESSAGE_STATUS_NEW,
  MESSAGE_STATUS_WIP,
  MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST
} from '../../../types/Message/iMessage';
import Toaster from '../../../services/Toaster';
import MessageService from '../../../services/MessageService';
import moment from 'moment-timezone';
import { CloudDownloadFill } from 'react-bootstrap-icons';
import FunnelService from '../../../services/Funnel/FunnelService';

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
`;

type iFunnelDownloadLatestPopupBtn = {
  onSubmitted?: (msg: iMessage) => void;
}
const FunnelDownloadLatestPopupBtn = ({onSubmitted}: iFunnelDownloadLatestPopupBtn) => {

  const [showingConfirmPanel, setShowingConfirmPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<iMessage | null>(null);

  const getLatestMessage = () => {
    setShowingConfirmPanel(true);
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({type: MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST}),
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
    FunnelService.download()
      .then(resp => {
        setMessage(resp);
        if (onSubmitted) {
          onSubmitted(resp);
        }
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
        <div><p>You are about to manually sync down all Funnel data.</p><b>THIS CAN NOT BE CANCELED ONCE STARTED</b> </div>
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
        header={<b>Sync from Funnel Now</b>}
        footer={getPopupFooter()}
      >
        {getPopupBody()}
      </PopupModal>
    )
  }

  const getContent = () => {
    return (
      <>
        <LoadingBtn
          variant={'danger'}
          isLoading={showingConfirmPanel}
          onClick={() => getLatestMessage()}
        >
          <CloudDownloadFill />{' '}Force Download Now
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

export default FunnelDownloadLatestPopupBtn;
