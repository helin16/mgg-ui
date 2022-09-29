import React, {useEffect, useState} from 'react';
import iOperooSafetyAlert, {
  OPEROO_STATUS_SAFETY_ALERT_NEW,
  OPEROO_STATUS_SAFETY_ALERT_UPDATED
} from '../../types/Operoo/iOperooSafetyAlert';
import OperooSafetyAlertService from '../../services/Operoo/OperooSafetyAlertService';
import {Spinner} from 'react-bootstrap';
import OperooSafetyAlertRow from './components/OperooSafetyAlertRow';
import SynVStudentService from '../../services/Synergetic/SynVStudentService';
import iVStudent from '../../types/Synergetic/iVStudent';
import * as _ from 'lodash';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import AdminPage from './AdminPage';
import {MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';

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
        // if (isCanceled) return;

        const resultMap = result.data.reduce((map, alert) => {
          // @ts-ignore
          const arr = (alert.studentId in map) ? map[alert.studentId] : [];
          arr.push(alert);
          return {
            ...map,
            [alert.studentId]: arr,
          }
        }, {});

        setOperooSafetyAlertMap(resultMap);
        const studentIds = Object.keys(resultMap);

        const students = await SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            ID: studentIds,
          }),
          perPage: `${studentIds.length}`,
          sort: 'StudentLegalFullName:ASC',
        });
        setStudents(students);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }

    getData();
    return () => {
      isCanceled = true;
    }
  }, [isViewingAdminPage])

  const handleAlertUpdated = (alert: iOperooSafetyAlert) => {
    if (!(alert.studentId in operooSafetyAlertMap)) {
      return;
    }
    const index = _.findIndex(operooSafetyAlertMap[alert.studentId], {id: alert.id});
    if (index < 0) {
      operooSafetyAlertMap[alert.studentId].push(alert);
    } else {
      operooSafetyAlertMap[alert.studentId].splice(index, 1, alert);
    }

    const alerts = operooSafetyAlertMap[alert.studentId].filter(alert => showAlertStatuses.indexOf(alert.status) >= 0);
    if (alerts.length > 0) {
      setOperooSafetyAlertMap({
        ...operooSafetyAlertMap,
        [alert.studentId]: alerts,
      });
    } else {
      delete operooSafetyAlertMap[alert.studentId];
      setOperooSafetyAlertMap(operooSafetyAlertMap);
      setStudents(students.filter(student => student.StudentID !== alert.studentId));
    }
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  if (isViewingAdminPage === true) {
    return <AdminPage backToReportFn={() => setIsViewingAdminPage(false) }/>
  }

  return <div className={'operoo-safety-alerts-page'}>
    <h3>
      Operoo Safety Alert Sync
      <span className={'pull-right'} >
        <ModuleAdminBtn onClick={() => setIsViewingAdminPage(true)} moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS} />
      </span>
    </h3>
    {students.map(student => {
      return <OperooSafetyAlertRow
        key={student.StudentID}
        alerts={student.StudentID in operooSafetyAlertMap ? operooSafetyAlertMap[student.StudentID] : []}
        student={student}
        onAlertUpdated={(alerts) => alerts.map(alert => handleAlertUpdated(alert))}
      />
    })}
  </div>
}

export default OperooSafetyAlertsPage;
