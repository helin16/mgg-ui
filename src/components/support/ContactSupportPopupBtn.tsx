import React, {useState} from 'react';
import PopupModal from '../common/PopupModal';
import {FloatingLabel, Form, Button, Alert} from 'react-bootstrap';

const ContactSupportPopupBtn = ({children}: {children: React.ReactNode}) => {
  const [showingPopup, setShowingPopup] = useState(false);

  const closePopup = () => {
    return setShowingPopup(false);
  }

  const getContactForm = () => {
    return (
      <Form>
        <Alert variant={'info'}>You will receive an support ticket as an receipt, after your submission.</Alert>
        <Form.Group>
          <FloatingLabel controlId="email" label="Your Email" className="mb-3">
            <Form.Control type='email' placeholder="Your Email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </FloatingLabel>
        </Form.Group>
        <Form.Group>
          <FloatingLabel controlId="message" label="Message" className="mb-3">
            <Form.Control as="textarea" placeholder="Your message" />
          </FloatingLabel>
        </Form.Group>
      </Form>
    )
  };

  const getFooter = () => {
    return (
      <>
        <Button variant="link" onClick={closePopup}>Close</Button>
        <Button variant="primary">Email</Button>
      </>
    )
  }

  return <>
    <span onClick={() => setShowingPopup(true)}>{children}</span>
    <PopupModal
      title={'Contact Support'}
      show={showingPopup}
      handleClose={closePopup}
      footer={getFooter()}
    >
      {getContactForm()}
    </PopupModal>
  </>
};

export default ContactSupportPopupBtn
