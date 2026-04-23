import LoadingBtn, {iLoadingBtn} from '../LoadingBtn';
import React, {useEffect, useState} from 'react';
import PopupModal, {iPopupModal} from '../PopupModal';
import MessageService from '../../../services/MessageService';
import Toaster from '../../../services/Toaster';
import iMessage from '../../../types/Message/iMessage';
import {Badge, Button, Spinner} from 'react-bootstrap';
import {FlexContainer} from '../../../styles';
import moment from 'moment-timezone';
import * as Icons from 'react-bootstrap-icons';

type iMessageCreatePopupBtn = iLoadingBtn & {
  msgType: string;
  createMsgFn: () => Promise<iMessage>;
  onMsgRefreshed?: (msg: iMessage | null) => void;
  popModalProps?: iPopupModal;
}
const MessageCreatePopupBtn = ({msgType, createMsgFn, popModalProps, onMsgRefreshed, ...props}: iMessageCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [latestMsg, setLatestMsg] = useState<iMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showingPopup) {
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({type: msgType, isActive: true, error: null, response: null}),
      sort: 'updatedAt:DESC',
      currentPage: '1',
      perPage: '1',
    }).then(resp => {
      if (isCanceled) {
        return;
      }
      setLatestMsg(resp.data.length > 0 ? resp.data[0] : null)
    }).catch(err => {
      if (isCanceled) {
        return;
      }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) {
        return;
      }
      setIsLoading(false);
    })
  }, [showingPopup, msgType]);

  useEffect(() => {
    if(!latestMsg || (latestMsg?.response !== null && latestMsg?.response !== null)) {
      return;
    }

    let isCanceled = false;
    const startPulling = async () => {
      try {
       const messages = await MessageService.getMessages({
          where: JSON.stringify({id: latestMsg.id, isActive: true, error: null, response: null}),
          currentPage: '1',
          perPage: '1',
        });
        if (isCanceled) {
          return;
        }
        const refreshedMsg = messages.data.length > 0 ? messages.data[0] : null;
        if (refreshedMsg === null) {
          setShowingPopup(false);
        }
        setLatestMsg(refreshedMsg);
        if (onMsgRefreshed) {
          onMsgRefreshed(refreshedMsg)
        }
      } catch(err) {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      }
    }
    setTimeout(() => startPulling(), 1000);

    return () => {
      isCanceled = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestMsg])

  const submit = () => {
    setIsSubmitting(true);
    createMsgFn()
      .then(resp => {
        if (!resp.error && !resp.response) {
          setLatestMsg(resp);
        }
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  const getPopupContent = () => {
    if (isLoading) {
      return (
        <>
          <Spinner animation={'border'} />
          <div>Checking current running jobs...</div>
        </>
      );
    }

    if (latestMsg !== null) {
      return (
        <div>
          <FlexContainer className={'withGap lg-gap'}>
            <Spinner animation={'border'} size={'sm'} />
            <div>Processing</div>
          </FlexContainer>
          <div>There is a Job started @ <b>{moment(latestMsg?.createdAt).format('lll')}</b>. Please wait until it finishes before request a new one.</div>
        </div>
      )
    }

    return (
      <div>
        <p>You are about to trigger another job for: <Badge bg={'secondary'}>{msgType}</Badge></p>
        <FlexContainer className={'justify-content-between'}>
          <div />
          <FlexContainer className={'with-gap'}>
            {isSubmitting === true ? null : <Button disabled={isSubmitting} variant={'link'} onClick={() => setShowingPopup(false)}><Icons.X /> Cancel</Button>}
            <LoadingBtn isLoading={isSubmitting} onClick={() => submit()}>
              <Icons.Send /> {' '}
              Trigger
            </LoadingBtn>
          </FlexContainer>
        </FlexContainer>
      </div>
    )
  }

  const getPopupHeader = () => {
    if (isLoading) {
      return (
        <h6>Checking current running jobs...</h6>
      );
    }
    if (latestMsg !== null) {
      return <h6>Got another running job.</h6>
    }
    return <h6>Triggering another job.</h6>
  }

  return (
    <div>
      <LoadingBtn {...props} onClick={() => setShowingPopup(true)}>{props.children || `Trigger another job`}</LoadingBtn>
      <PopupModal
        {...popModalProps}
        show={showingPopup}
        header={getPopupHeader()}
        handleClose={() => setShowingPopup(isSubmitting)}
      >
        {getPopupContent()}
      </PopupModal>
    </div>
  )
}

export default MessageCreatePopupBtn;
