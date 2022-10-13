import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import {MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ModuleUserList from '../../components/module/ModuleUserList';
import OperooDownloadPanel from './components/Admin/OperooDownloadPanel';
import OperooSafetyAlertModuleEditPanel from './components/Admin/OperooSafetyAlertModuleEditPanel';
import styled from 'styled-components';

type iAdminPage = {backToReportFn?: () => void};
const Wrapper = styled.div`
  .section-row {
    margin-bottom: 2rem;
  }
`;
const AdminPage = ({backToReportFn}: iAdminPage) => {

  const getBackToReportBtn  = () => {
    if (!backToReportFn) {
      return null;
    }
    return (
      <Button variant={'link'} size={'sm'} onClick={() => backToReportFn()}>
        <Icons.ArrowLeft />
      </Button>
    )
  }

  return (
    <Wrapper>
      <h3>
        {getBackToReportBtn()}
        Operoo Safety Alert Admin
      </h3>
      <div className={'section-row'}>
        <h5>Users</h5>
        <small>List of users who can access this module and process alerts. They will receive email notifications</small>
        <ModuleUserList moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS} roleId={ROLE_ID_NORMAL} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>
      <div className={'section-row'}>
        <h5>Admin</h5>
        <small>List of users who can access this module, process alerts and manage users. They will <b>NOT</b> receive email notifications</small>
        <ModuleUserList moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>
      <div className={'section-row'}>
        <h5>Module Settings</h5>
        <OperooSafetyAlertModuleEditPanel />
      </div>
      <div className={'section-row'}>
        <h5>Download From Operoo</h5>
        <OperooDownloadPanel />
      </div>
    </Wrapper>
  )
}

export default AdminPage;
