import styled from 'styled-components';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_ALUMNI_REQUEST} from '../../types/modules/iModuleUser';
import React, {useState} from 'react';
import ExplanationPanel from '../../components/ExplanationPanel';
import AlumniRequestList from './components/AlumniRequestList';
import AlumniRequestAdminPage from './AlumniRequestAdminPage';
import {Button} from 'react-bootstrap';
import {URL_ALUMNI_REGISTRATION} from '../../Url';
import * as Icons from 'react-bootstrap-icons';

const Wrapper = styled.div``;
const AlumniRequestPage = () => {
  const [showingAdminPage, setShowingAdminPage] = useState(false);

  const getContent = () => {
    if (showingAdminPage === true) {
      return <AlumniRequestAdminPage onDirectBack={() => setShowingAdminPage(false)} />;
    }

    return (
      <>
        <div className={'section-row'}>
          <h3>
            Alumni Requests
            <div className={'float-right'}>
              <Button variant={'link'} href={`${process.env.REACT_APP_URL || ''}${URL_ALUMNI_REGISTRATION}`} target={'__BLANK'}>
                <Icons.Link /> Registration Page
              </Button>
              <ModuleAdminBtn
                moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
                onClick={() => setShowingAdminPage(true)}
              />
            </div>
          </h3>
          <ExplanationPanel text={
            <>
              A list of Alumni Requests that submitted by <b>Old Girls</b> via Library / Digital Archive
            </>
          } />
        </div>

        <AlumniRequestList />
      </>
    )
  }

  return (
    <Wrapper>{getContent()}</Wrapper>
  )
}

export default AlumniRequestPage;
