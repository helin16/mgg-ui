import React from 'react';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../../../components/module/ModuleUserList';
import {MODULE_ID_STUDENT_REPORT} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';


const AdminUserList = ({backToAdminFn}: {backToAdminFn?: () => void}) => {
  return (
    <div>
      <h3>
        <Button variant={'link'} size={'sm'} onClick={backToAdminFn}>
          <Icons.ArrowLeft />
        </Button>
        Student Report Admin - Users
      </h3>
      <ModuleUserList moduleId={MODULE_ID_STUDENT_REPORT} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
    </div>
  )
};

export default AdminUserList;
