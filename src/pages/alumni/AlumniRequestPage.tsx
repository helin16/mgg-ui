import { MGGS_MODULE_ID_ALUMNI_REQUEST } from "../../types/modules/iModuleUser";
import React from "react";
import ExplanationPanel from "../../components/ExplanationPanel";
import AlumniRequestList from "./components/AlumniRequestList";
import AlumniRequestAdminPage from "./AlumniRequestAdminPage";
import Page from "../../layouts/Page";
import {URL_ALUMNI_REGISTRATION} from '../../Url';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

const AlumniRequestPage = () => {
  return (
    <Page
      title={<h3>Alumni Requests</h3>}
      moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
      AdminPage={AlumniRequestAdminPage}
      extraBtns={
        <Button variant={'link'} href={`${process.env.PUBLIC_URL || ''}${URL_ALUMNI_REGISTRATION}`} target={'__BLANK'}>
          <Icons.Link45deg /> Registration Page
        </Button>
      }
    >
      <ExplanationPanel
        text={
          <>
            A list of Alumni Requests that submitted by <b>Old Girls</b> via
            Library / Digital Archive
          </>
        }
      />
      <AlumniRequestList />
    </Page>
  );
};

export default AlumniRequestPage;
