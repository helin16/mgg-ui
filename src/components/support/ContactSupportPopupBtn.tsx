import React, {useEffect, useState} from 'react';
import PopupModal from '../common/PopupModal';
import {FloatingLabel, Form, Alert, Button} from 'react-bootstrap';
import styled from 'styled-components';
import LoadingBtn from '../common/LoadingBtn';
import SupportService from '../../services/SupportService';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';

const FormWrapper = styled.div`
  .message-box {
    height: 100px;
  }
`;
type iEmailData = {email?: string; messages?: string;};
const ContactSupportPopupBtn = ({children}: {children: React.ReactNode}) => {
  const {user: currentUser} = useSelector((state: RootState) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showingPopup, setShowingPopup] = useState(false);
  const [emailData, setEmailData] = useState<iEmailData>({});
  const [newMessage, setNewMessage] = useState<{ id: string } | null>(null);

  useEffect(() => {
    if (!currentUser || !currentUser?.SynCommunity) {
      return;
    }
    setEmailData((data) => ({
      ...data,
      email: currentUser?.SynCommunity?.OccupEmail,
    }))
  }, [currentUser])

  const closePopup = () => {
    setNewMessage(null);
    setShowingPopup(false);
  }

  const changeEmailData = (fieldName: string, newValue: string) => {
    setEmailData({
      ...emailData,
      [fieldName]: newValue,
    })
  }

  const submit = () => {
    setIsSubmitting(true);
    SupportService.reportIssue({
        email: emailData.email || '',
        messages: emailData.messages || '',
        url: window.location.href || '',
      }).then(resp => {
        // @ts-ignore
        setNewMessage(resp);
        setEmailData({
          email: currentUser?.SynCommunity?.OccupEmail
        })
      }).finally(() => {
        setIsSubmitting(false);
      })
  }

  const getContactForm = () => {
    return (
      <FormWrapper>
        <Form>
          <Alert variant={'warning'}>
            You will receive an support ticket as an receipt, after your submission.
            <br />
            <b>Please make sure you have the ticket number as the reference when you reach us in the future.</b>
          </Alert>
          <Form.Group>
            <FloatingLabel controlId="email" label="Your Email" className="mb-3">
              <Form.Control
                type='email'
                placeholder="Your Email" value={emailData.email || ''}
                onChange={(event) => changeEmailData('email', event.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel controlId="message" label="Message" className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Your message"
                className={'message-box'}
                value={emailData.messages || ''}
                onChange={(event) => changeEmailData('messages', event.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
        </Form>
      </FormWrapper>
    )
  };

  const getFooter = () => {
    if (newMessage === null ){
      return (
        <>
          <LoadingBtn variant="link" onClick={closePopup} isLoading={isSubmitting === true}>Close</LoadingBtn>
          <LoadingBtn variant="primary" onClick={submit} isLoading={isSubmitting === true}>Email</LoadingBtn>
        </>
      )
    }
    return (
      <Button variant="primary" onClick={closePopup} >Close</Button>
    )
  }

  const getSuccessfullyMessage = () => {
    if (newMessage === null) {
      return ;
    }
    return <Alert variant={'success'}>
      Reported successfully.
      <p>Please make sure you have the ticket number as the reference when you reach us in the future.</p>
    </Alert>
  }

  return <>
    <span onClick={() => setShowingPopup(true)}>{children}</span>
    <PopupModal
      title={'Contact Support'}
      show={showingPopup}
      handleClose={closePopup}
      footer={getFooter()}
    >
      {newMessage === null ? getContactForm() : getSuccessfullyMessage()}
    </PopupModal>
  </>
};

export default ContactSupportPopupBtn
