import styled from 'styled-components';
import {Alert, Button, Form} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../StudentAcademicReportDetails';
import React, {ChangeEvent, useState} from 'react';
import PopupModal from '../../../../../components/common/PopupModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/makeReduxStore';
import StudentReportService from '../../../../../services/Synergetic/StudentReportService';
import LoadingBtn from '../../../../../components/common/LoadingBtn';
import iAsset from '../../../../../types/asset/iAsset';

const Wrapper = styled.div`
  font-size: 12px;
`

const StudentAcademicEmailPopup = ({
  student,
  studentReportYear,
  onClose
}: StudentAcademicReportDetailsProps & { onClose: () => void } ) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState(user?.SynCommunity?.Email || '')
  const [isLoading, setIsLoading] = useState(false);
  const [downloadableAsset, setDownloadableAsset] = useState<iAsset | null>(null);

  const sendEmail = () => {
    setIsLoading(true);
    StudentReportService.emailStudentReportPDF(student.ID, studentReportYear.ID, { email })
      .then(resp => {
        setDownloadableAsset(resp);
        setIsLoading(true);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const getFooter = () => {
    if (downloadableAsset === null) {
      return (
        <>
          {isLoading === true ? null : <Button variant="link" onClick={() => onClose()}>Cancel</Button>}
          <LoadingBtn
            variant="primary"
            isLoading={isLoading}
            disabled={`${email || ''}`.trim() === ''}
            onClick={() => sendEmail()}
          >
            Email
          </LoadingBtn>
        </>
      )
    }
    return (
      <Button variant="primary" onClick={() => onClose()}>OK</Button>
    )
  }

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const getForm = () => {
    if (downloadableAsset === null) {
      return (
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label><small>Please enter the email address you want to send the report to below.</small></Form.Label>
          <Form.Control
            type="email" placeholder="The email address that the report will be sent to"
            value={email}
            onChange={changeEmail}
          />
        </Form.Group>
      )
    }
    return (
      <Alert variant={'success'}>
        <h5>Email successfully queued.</h5>
        <p>Please allow up to 5 minutes for your report to be received.</p>
      </Alert>
    );
  }

  return (
    <PopupModal
      show={true}
      size={'lg'}
      centered
      handleClose={ () => onClose() }
      footer={getFooter()}
      header={<h5>Email PDF Report for: {student.StudentGiven1} {student.StudentSurname}</h5>}
    >
      {getForm()}

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
            <a href="https://get.adobe.com/reader/" target={'__BLANK'}>https://get.adobe.com/reader/</a>
          </li>
        </ul>
      </Wrapper>
    </PopupModal>
  )
};

export default StudentAcademicEmailPopup;
