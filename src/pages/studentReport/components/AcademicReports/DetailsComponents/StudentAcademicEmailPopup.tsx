import styled from 'styled-components';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../StudentAcademicReportDetails';
import React, {ChangeEvent, useState} from 'react';
import PopupModal from '../../../../../components/common/PopupModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/makeReduxStore';

const Wrapper = styled.div`
  font-size: 12px;
`

const StudentAcademicEmailPopup = ({
  student,
  onClose
}: StudentAcademicReportDetailsProps & { onClose: () => void } ) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState(user?.SynCommunity?.Email || '')

  const getFooter = () => {
    return (
      <>
        <Button variant="link" onClick={() => onClose()}>Cancel</Button>
        <Button variant="primary" disabled={`${email || ''}`.trim() === ''}>Email</Button>
      </>
    )
  }

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  return (
    <PopupModal
      show={true}
      size={'lg'}
      centered
      handleClose={ () => onClose() }
      footer={getFooter()}
    >
      <Row>
        <Col><h4>Email PDF Report</h4></Col>
        <Col className={'text-right'}>{student.StudentGiven1} {student.StudentSurname}</Col>
      </Row>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label><small>Please enter the email address you want to send the report to below.</small></Form.Label>
        <Form.Control type="email" placeholder="The email address that the report will be sent to"
          value={email}
          onChange={changeEmail}
        />
      </Form.Group>

      <Wrapper className="email-explanation-panel">
        <h6 className="text-danger"><i>Not Receiving The Report Email?</i></h6>
        <ul>
          <li>Please allow up to 5 minutes for your report to be received.</li>
          <li>Ensure the e-mail address you have entered is correct.</li>
          <li>Add 'donotreply@mentonegirls.vic.edu.au' to your safe senders list.</li>
          <li>Check that the e-mail has not been sent to your junk/spam folder.</li>
          <li>If you still have not received the e-mail, please try sending to an alternate e-mail address.</li>
        </ul>
        <h6 className="text-danger"><i>Having Trouble Viewing The PDF File?</i></h6>
        <ul>
          <li>Please ensure you have the latest version of Adobe Acrobat Reader installed on your computer.</li>
          <li>Adobe Acrobat Reader can be downloaded from:
            <a href="https://get.adobe.com/reader/" target="_blank">https://get.adobe.com/reader/</a>
          </li>
        </ul>
      </Wrapper>
    </PopupModal>
  )
};

export default StudentAcademicEmailPopup;
