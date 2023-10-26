import React, {useEffect, useState} from 'react';
import iOperooSafetyAlert, {
  OPEROO_STATUS_SAFETY_ALERT_NEW,
  OPEROO_STATUS_SAFETY_ALERT_UPDATED
} from '../../types/Operoo/iOperooSafetyAlert';
import OperooSafetyAlertService from '../../services/Operoo/OperooSafetyAlertService';
import OperooSafetyAlertRow from './components/OperooSafetyAlertRow';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import iVStudent from '../../types/Synergetic/iVStudent';
import {MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
import Page from '../../layouts/Page';
import Toaster from '../../services/Toaster';
import ExplanationPanel from '../../components/ExplanationPanel';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import Page401 from '../../components/Page401';
import OperooSafetyAlertsAdminPage from './OperooSafetyAlertsAdminPage';

const showAlertStatuses = [OPEROO_STATUS_SAFETY_ALERT_NEW, OPEROO_STATUS_SAFETY_ALERT_UPDATED];

const OperooSafetyAlertsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [operooSafetyAlertMap, setOperooSafetyAlertMap] = useState<{[key: number]: iOperooSafetyAlert[]}>({});
  const [students, setStudents] = useState<iVStudent[]>([]);

  useEffect(() => {
    let isCanceled = false;

    const getData = async () => {
      setIsLoading(true);
      try {

        const result = await OperooSafetyAlertService.getOperooSafetyAlerts({
          where: JSON.stringify({
            isActive: true,
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
  }, [])

  if (isLoading === true) {
    return <PageLoadingSpinner />
  }

  return (
    <Page className={'operoo-safety-alerts-page'} title={<h3>
      Operoo Safety Alert Sync</h3>} moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS} AdminPage={OperooSafetyAlertsAdminPage}>
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
