import PopupBtn from '../common/PopupBtn';
import {ButtonProps} from 'react-bootstrap';
import iSynVAttendance from '../../types/Synergetic/Attendance/iSynVAttendance';
import AttendanceTable from './AttendanceTable';
import AttendanceHelper from './AttendanceHelper';

export type iAttendanceTablePopupBtn = ButtonProps & {
  attendances: iSynVAttendance[];
  popupTitle?: any;
  showStudentID?: boolean;
};

const AttendanceTablePopupBtn = ({attendances, popupTitle, showStudentID = true, ...props} : iAttendanceTablePopupBtn) => {
  return (
    <PopupBtn popupProps={{
      dialogClassName: 'modal-90w',
      title: popupTitle,
      children: (
        <>
          {AttendanceHelper.getReportableAbsenceAlertPanel()}
          <AttendanceTable attendances={attendances} showStudentID={showStudentID}/>
        </>
      )
    }} {...props} />
  )
}

export default AttendanceTablePopupBtn;
