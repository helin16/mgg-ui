import React, {useEffect, useState} from 'react';
import iOperooSafetyAlert, {
  OPEROO_STATUS_SAFETY_ALERT_NEW,
  OPEROO_STATUS_SAFETY_ALERT_UPDATED
} from '../../types/Operoo/iOperooSafetyAlert';
import OperooSafetyAlertService from '../../services/Operoo/OperooSafetyAlertService';
import OperooSafetyAlertRow from './components/OperooSafetyAlertRow';
import SynVStudentService from '../../services/Synergetic/SynVStudentService';
import iVStudent from '../../types/Synergetic/iVStudent';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import AdminPage from './AdminPage';
import {MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
import Page from '../../layouts/Page';
import Toaster from '../../services/Toaster';
import ExplanationPanel from '../../components/ExplanationPanel';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import Page401 from '../../components/Page401';

const showAlertStatuses = [OPEROO_STATUS_SAFETY_ALERT_NEW, OPEROO_STATUS_SAFETY_ALERT_UPDATED];

const OperooSafetyAlertsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [operooSafetyAlertMap, setOperooSafetyAlertMap] = useState<{[key: number]: iOperooSafetyAlert[]}>({});
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [isViewingAdminPage, setIsViewingAdminPage] = useState(false);

  useEffect(() => {
    if (isViewingAdminPage) {
      return;
    }
    let isCanceled = false;

    const getData = async () => {
      setIsLoading(true);
      try {

        const result = await OperooSafetyAlertService.getOperooSafetyAlerts({
          where: JSON.stringify({
            status: showAlertStatuses,
          }),
          perPage: '1000',
        });
        if (isCanceled) return;

        const resultMap = result.data.reduce((map, alert) => {
          // @ts-ignore
          const arr = (alert.studentId in map) ? map[alert.studentId] : [];
          arr.push(alert);
          return {
            ...map,
            [alert.studentId]: arr,
          }
        }, {});

        if (isCanceled) return;
        setOperooSafetyAlertMap(resultMap);
        const studentIds = Object.keys(resultMap);
        const students = await SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            ID: studentIds,
          }),
          perPage: `${studentIds.length}`,
          sort: 'StudentSurname:ASC',
        });
        if (isCanceled) return;
        setStudents(students);
        setIsLoading(false);
      } catch (err) {
        Toaster.showApiError(err);
        setIsLoading(false);
      }
    }

    getData();
    return () => {
      isCanceled = true;
    }
  }, [isViewingAdminPage])

  if (isLoading === true) {
    return <PageLoadingSpinner />
  }

  if (isViewingAdminPage === true) {
    return <AdminPage backToReportFn={() => setIsViewingAdminPage(false) }/>
  }

  return (
    <Page className={'operoo-safety-alerts-page'}>
      <h3>
        Operoo Safety Alert Sync
        <span className={'pull-right'} >
          <ModuleAdminBtn onClick={() => setIsViewingAdminPage(true)} moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS} />
        </span>
      </h3>
      <ExplanationPanel text={'This module is designed for the School Nurse to auto sync down Operoo Docs to Synergetic DocMan'} />
      {students.length <= 0 ? (
        <Page401
          title={'No records found'}
          description={'Hooray, you are up to date with your douments from Operoo.'}
          variant={'success'}
          showLogo={false}
        />
      ) : null}
      {students.map(student => {
        return <OperooSafetyAlertRow
          key={student.StudentID}
          alerts={student.StudentID in operooSafetyAlertMap ? operooSafetyAlertMap[student.StudentID] : []}
          student={student}
        />
      })}
    </Page>
  );
}

export default OperooSafetyAlertsPage;
