import React from 'react';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_ALUMNI_REQUEST} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import AlumniModuleEditPanel from './components/AlumniModuleEditPanel';


type iAlumniRequestAdminPage = {
  onDirectBack: () => void;
}
const AlumniRequestAdminPage = ({onDirectBack}: iAlumniRequestAdminPage) => {
  return (
    <>
      <h3>
        Alumni Request Admin
        <div className={'float-right'}>
          <Button variant={'outline-secondary'} onClick={() => onDirectBack()}>
            <Icons.ArrowBarLeft /> Back
          </Button>
        </div>
      </h3>

      <div className={'section-row'}>
        <h4>Approvers</h4>
        <small>A list of users who can approve the request and receive email notifications when a new request submitted.</small>
        <ModuleUserList moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST} roleId={ROLE_ID_NORMAL} showDeletingBtn={true} showCreatingPanel={true}/>
      </div>

      <div className={'section-row'}>
        <h4>Admins</h4>
        <small>A list of users manage this module and will NOT receive any emails when a new request submitted.</small>
        <ModuleUserList moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST} roleId={ROLE_ID_ADMIN} showDeletingBtn={true}  showCreatingPanel={true} />
      </div>

      <div className={'section-row'}>
        <h5>Module Settings</h5>
        <AlumniModuleEditPanel />
      </div>
    </>
  )
}

export default AlumniRequestAdminPage;
