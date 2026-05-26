import React, {useEffect} from 'react';
import {Alert, Container, Button} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';

import LoadComponents from '../../LoadComponents';

const ClipboardConcussionSessionsTestPage = () => {
  const location = useLocation();

  useEffect(() => {
    LoadComponents.loadAll();
  }, [location.pathname]);

  return (
    <Container className={'py-4'}>
      <h3>Clipboard Concussion/Sessions Test Page</h3>
      <Alert variant={'info'}>
        This page intentionally tests LoadComponents.loadAll() using an attendance-style URL.
        Tests both ClipboardConcussionAlert and ClipboardStudentSessionAlert components.
        Example: /modules/attendance/modify/S/PSY11A-26/2026-05-25/3/S/A.
      </Alert>

      <div id={'container'}>
        <div id={'attendance-time-steps'} />
        <div className={'row py-2 border-top'}>
          <div className={'col'}>Attendance form first row (alerts should render below this row).</div>
        </div>
        <div className={'row py-2'}>
          <div className={'col'}>Attendance form second row.</div>
        </div>
        <div className={'row py-2 mt-4'}>
          <div className={'col'}>
            <Button id={'attendance-form-submit'} variant={'primary'}>
              Submit Attendance
            </Button>
            <small className={'text-muted ms-3'}>
              Session alert should be cloned above this button.
            </small>
          </div>
        </div>
      </div>

      <div className={'mt-3'}>
        <small className={'text-muted'}>
          LoadComponents.loadAll() is invoked automatically on page load.
          This includes loadStudentSessionAlertForAClassCode() and loadStudentSessionAlertBeforeFormSubmit().
        </small>
      </div>
    </Container>
  );
};

export default ClipboardConcussionSessionsTestPage;
