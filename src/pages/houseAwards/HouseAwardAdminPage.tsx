import {FlexContainer} from '../../styles';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MODULE_ID_HOUSE_AWARDS} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import React from 'react';
import HouseAwardEventTable from './components/HouseAwardEventTable';
import HouseAwardEventTypeTable from './components/HouseAwardEventTypeTable';

type iHouseAwardAdminPage = {
  onCancel?: () => void;
}

const HouseAwardAdminPage = ({ onCancel }: iHouseAwardAdminPage) => {
  return (
    <>
      <FlexContainer className={'withGap space-below'}>
        <Button variant={'link'} onClick={() => onCancel && onCancel()} title={'back to House Award Board'}>
          <Icons.ArrowLeft />
        </Button>
        <h4>House Award Admin</h4>
      </FlexContainer>

      <div className={'space-below'}>
        <h5>Users</h5>
        <small>List of users who can access this module and process alerts. They will receive email notifications</small>
        <ModuleUserList moduleId={MODULE_ID_HOUSE_AWARDS} roleId={ROLE_ID_NORMAL} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>

      <div className={'space-below'}>
        <h5>Admin</h5>
        <small>List of users who can access this module, process alerts and manage users. They will <b>NOT</b> receive email notifications</small>
        <ModuleUserList moduleId={MODULE_ID_HOUSE_AWARDS} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>

      <div className={'space-below'}>
        <HouseAwardEventTypeTable />
      </div>

      <div className={'space-below'}>
        <HouseAwardEventTable />
      </div>
    </>
  )
}

export default HouseAwardAdminPage;
