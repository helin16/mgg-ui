import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import AdminUserList from './components/Admin/AdminUserList';
import AdminReportList from './components/Admin/AdminReportList';
import iStudentReportYear from '../../types/Synergetic/iStudentReportYear';
import AdminEditReportYear from './components/Admin/AdminEditReportYear';

const btnTextClassName = 'd-none d-sm-inline-block';

const AdminPage = ({backToReportFn}: {backToReportFn?: () => void}) => {
  const [showingAdminUsers, setShowingAdminUsers] = useState(false);
  const [editingReportYear, setEditingReportYear] = useState<iStudentReportYear | null | undefined>(undefined);

  if (showingAdminUsers === true) {
    return <AdminUserList backToAdminFn={() => setShowingAdminUsers(false)}/>
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
