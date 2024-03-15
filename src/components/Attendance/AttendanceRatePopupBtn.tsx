import {iAttendanceTablePopupBtn} from './AttendanceTablePopupBtn';
import PopupBtn from '../common/PopupBtn';
import AttendanceTable from './AttendanceTable';
import AttendanceHelper from './AttendanceHelper';


const AttendanceRatePopupBtn = ({attendances, popupTitle, showStudentID = true, ...props}: iAttendanceTablePopupBtn) => {
  return (
    <PopupBtn popupProps={{
      dialogClassName: 'modal-90w',
      title: popupTitle || 'Attendance Rate (%)',
      children: (
        <>
          {AttendanceHelper.getReportableAbsenceAlertPanel()}
          <AttendanceTable attendances={attendances} showStudentID={showStudentID}/>
        </>
      )
    }} {...props} />
  )
}

export default AttendanceRatePopupBtn;
