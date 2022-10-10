import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import {MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ModuleUserList from '../../components/module/ModuleUserList';
import OperooDownloadPanel from './components/OperooDownloadPanel';

type iAdminPage = {backToReportFn?: () => void}
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
    <div>
      <h3>
        {getBackToReportBtn()}
        Operoo Safety Alert Admin
      </h3>
      <div>
        <h5>Users</h5>
        <small>List of users who can access this module and process alerts</small>
        <ModuleUserList moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS} roleId={ROLE_ID_NORMAL} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>
      <div>
        <h5>Admin</h5>
        <small>List of users who can access this module, process alerts and manage users</small>
        <ModuleUserList moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>
      <div>
        <h5>Download From Operoo</h5>
        <OperooDownloadPanel />
      </div>
    </div>
  )
}

export default AdminPage;
