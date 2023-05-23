import React, {useEffect, useState} from 'react';
import {Alert, Button} from 'react-bootstrap';
import PopupModal from '../../components/common/PopupModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import * as Icons from 'react-bootstrap-icons';

const SchoolBoxUrlCheckPopup = () => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [currentHost, setCurrentHost] = useState('');
  const {backendSchoolBoxUrl} = useSelector((state: RootState) => state.app);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const currentHost = `${currentUrl.protocol}//${currentUrl.host}`;
    setCurrentHost(currentHost);
    setShowingPopup(`${currentHost}`.trim().toLowerCase() !== `${backendSchoolBoxUrl}`.trim().toLowerCase());
    // if (`${currentUrl.ho}`)
  }, [backendSchoolBoxUrl])

  return (
    <PopupModal
      show={showingPopup}
      handleClose={() => setShowingPopup(false)}
      title={`Be Aware`}
      footer={
        <>
          <div />
          <div>
            <Button variant={'primary'} size={'sm'} onClick={() => setShowingPopup(false)}>OK</Button>
          </div>
        </>
      }
    >
      <Alert variant={'danger'}>
        <h6>
          <Icons.ExclamationTriangleFill /> {' '}
          You are NOT on the same SchoolBox as expected
        </h6>
      </Alert>
      <div>Current host: <b>{currentHost}</b></div>
      <div>Expected host: <b>{backendSchoolBoxUrl}</b></div>
    </PopupModal>
  );
}

export default SchoolBoxUrlCheckPopup;
