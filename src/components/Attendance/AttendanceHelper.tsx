import iSynVAttendance from '../../types/Synergetic/Attendance/iSynVAttendance';
import MathHelper from '../../helper/MathHelper';
import {Alert} from 'react-bootstrap';

const getReportableAbsenceAlertPanel = () => {
  return (
    <Alert variant={'secondary'}>
      Reportable Absence: NOT attended any none-canceled class without Reason or the Reason is marked as count-as-absence.
    </Alert>
  )
}

const calculateAttendanceRate = (attendances: iSynVAttendance[]) => {
  if (attendances.length <= 0) {
    return '0.00';
  }
  const reportableAbsences = attendances.filter(att => isReportableAbsence(att));
  return MathHelper.mul(MathHelper.div(reportableAbsences.length, attendances.length), 100).toFixed(2);
}

const isReportableAbsence = (attendance: iSynVAttendance) => {
  if (attendance.AttendedFlag === true || attendance.ClassCancelledFlag === true) {
    return false;
  }

  if(`${attendance?.PossibleAbsenceCode || ''}`.trim() === '') {
    return true;
  }

  if(`${attendance?.PossibleAbsenceType?.Code || ''}`.trim() !== '' && attendance?.PossibleAbsenceType?.CountAsAbsenceFlag === true) {
    return true;
  }

  return false;
}

const AttendanceHelper = {
  isReportableAbsence,
  calculateAttendanceRate,
  getReportableAbsenceAlertPanel
}

export default AttendanceHelper;
