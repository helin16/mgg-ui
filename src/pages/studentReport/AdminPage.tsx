import React, {useState} from 'react';
import {Alert, Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import AdminReportList from './components/Admin/AdminReportList';
import iStudentReportYear from '../../types/Synergetic/iStudentReportYear';
import AdminEditReportYear from './components/Admin/AdminEditReportYear';
import AdminEditingLockList from './components/Admin/AdminEditingLockList';
import AdminPageHeader from './components/Admin/AdminPageHeader';
import {MODULE_ID_STUDENT_REPORT} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import ModuleUserList from '../../components/module/ModuleUserList';
import GenComparativePopupBtn from './components/Admin/GenComparativePopupBtn';

const btnTextClassName = 'd-none d-sm-inline-block';

const AdminPage = ({backToReportFn}: {backToReportFn?: () => void}) => {
  const [showingAdminUsers, setShowingAdminUsers] = useState(false);
  const [showingEditingLocks, setShowingEditingLocks] = useState(false);
  const [editingReportYear, setEditingReportYear] = useState<iStudentReportYear | null | undefined>(undefined);

  if (showingAdminUsers === true) {
    return (
      <div>
        <AdminPageHeader title={'Student Report Admin - Users'} backToAdminFn={() => setShowingAdminUsers(false)} />
        <ModuleUserList moduleId={MODULE_ID_STUDENT_REPORT} roleId={ROLE_ID_ADMIN} showCreatingPanel={true} showDeletingBtn={true}/>
      </div>
    );
  }

  if (showingEditingLocks === true) {
    return (
      <div>
        <AdminPageHeader
          title={'Student Report Admin - Editing Locks'}
          backToAdminFn={() => setShowingEditingLocks(false)}
        />
        <div>
          <small>
            Below is a list of editing locks done by the teacher during reports time, please click <b className={'text-danger'}>Unlock</b>  to release Synergetic lock
          </small>
          <Alert variant={'warning'}>
            <div><b>THIS MAY CAUSE DATA LOST</b></div>
            The lock will be automatically unlocked after the expiry time. Manual unlocking can ONLY be done when
            teachers are blocked and seeking for help
          </Alert>
        </div>
        <AdminEditingLockList />
      </div>
    );
  }

  if (editingReportYear !== undefined) {
    return <AdminEditReportYear
      reportYear={editingReportYear}
      onCancel={() => setEditingReportYear(undefined)}
    />;
  }

  return (
    <div>
      <h3>
        Student Report Admin
        <span className={'pull-right'}>
          <Button variant={'outline-secondary'} size={'sm'} onClick={backToReportFn}>
            <Icons.Search />{' '}
            <span className={btnTextClassName}>Reports</span>
          </Button>
          {' '}
          <GenComparativePopupBtn />
          {' '}
          <Button
            variant={'outline-danger'}
            size={'sm'}
            title={'Synergetic Report Editing Locks'}
            onClick={() => setShowingEditingLocks(true)}
          >
            <Icons.LockFill />{' '}
            <span className={btnTextClassName}>Locks</span>
          </Button>
          {' '}
          <Button variant={'success'} size={'sm'} onClick={() => setShowingAdminUsers(true)}>
            <Icons.PeopleFill />{' '}
            <span className={btnTextClassName}>Users</span>
          </Button>
        </span>
      </h3>
      <AdminReportList onSelected={(report) => setEditingReportYear(report)}/>
    </div>
  )
};

export default AdminPage;
