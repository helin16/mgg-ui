import React, {useEffect} from 'react';
import {Alert, Container} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';

import LoadComponents from '../../LoadComponents';

const ClipboardConcussionAlertTestPage = () => {
  const location = useLocation();

  useEffect(() => {
    LoadComponents.loadAll();
  }, [location.pathname]);

  return (
    <Container className={'py-4'}>
      <h3>Clipboard Concussion Alert Test Page</h3>
      <Alert variant={'info'}>
        This page intentionally tests LoadComponents.loadAll() using an attendance-style URL.
        Example: /modules/attendance/modify/S/PSY11A-26/2026-05-25/3/S/A.
      </Alert>

      <div id={'container'}>
        <div id={'attendance-time-steps'} />
        <div className={'row py-2 border-top'}>
          <div className={'col'}>Attendance form first row (alert should render below this row).</div>
        </div>
        <div className={'row py-2'}>
          <div className={'col'}>Attendance form second row.</div>
        </div>
      </div>

      <div className={'mt-3'}>
        <small className={'text-muted'}>
          LoadComponents.loadAll() is invoked automatically on page load.
        </small>
      </div>
    </Container>
  );
};

export default ClipboardConcussionAlertTestPage;
