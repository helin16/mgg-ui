import {iAttendanceTablePopupBtn} from './AttendanceTablePopupBtn';
import PopupBtn from '../common/PopupBtn';
import AttendanceTable from './AttendanceTable';
import AttendanceHelper from './AttendanceHelper';
import {FlexContainer} from '../../styles';
import styled from 'styled-components';
import {mainBlue} from '../../AppWrapper';
import {useEffect, useState} from 'react';
import iSynVAttendance from '../../types/Synergetic/Attendance/iSynVAttendance';
import {Button} from 'react-bootstrap';

const Wrapper = styled.div`
    .summary-row {
        > div {
            display: inline-flex;
            
            .btn {
                font-size: 24px;
            }

            h3 {
                margin: 0px;
            }
            
            &.summary-cell {
                border: 2px solid ${mainBlue};
                border-radius: 8px;
                display: flex;
                flex-direction: column;

                small {
                    background-color: ${mainBlue};
                    color: white;
                    padding: 0.1rem 1rem;
                }
            }
        }
    }
`;

const AttendanceRatePopupBtn = ({attendances, popupTitle, showStudentID = true, ...props}: iAttendanceTablePopupBtn) => {

  const [showingAtts, setShowingAtts] = useState<iSynVAttendance[]>([]);

  useEffect(() => {
    setShowingAtts(attendances);
  }, [attendances]);

  const reportableAbsences = attendances.filter(att => AttendanceHelper.isReportableAbsence(att));

  return (
    <PopupBtn popupProps={{
      dialogClassName: 'modal-90w',
      title: popupTitle || 'Attendance Rate (%)',
      children: (
        <Wrapper>
          {AttendanceHelper.getReportableAbsenceAlertPanel()}
          <FlexContainer className={'space-below space-above justify-content-center with-gap lg-gap summary-row align-items-center'}>
            <div>
              (
            </div>
            <div className={'summary-cell'}>
              <Button variant={'link'} onClick={() => setShowingAtts(attendances)}>
                {attendances.length}
              </Button>
              <small>Total Attendances</small>
            </div>
            <div>
            -
            </div>
            <div className={'summary-cell'}>
              <Button variant={'link'} onClick={() => setShowingAtts(reportableAbsences)}>
                {reportableAbsences.length}
              </Button>
              <small>Reportable Absences</small>
            </div>
            <div>
              )
            </div>

            <div>
              &#247;
            </div>
            <div className={'summary-cell'}>
              <Button variant={'link'} onClick={() => setShowingAtts(attendances)}>
                {attendances.length}
              </Button>
              <small>Total Attendances</small>
            </div>
            <div>
            =
            </div>
            <div>
              <h3>{AttendanceHelper.calculateAttendanceRate(attendances)} %</h3>
            </div>
          </FlexContainer>
          <AttendanceTable attendances={showingAtts} showStudentID={showStudentID}/>
        </Wrapper>
      )
    }} {...props} />
  )
}

export default AttendanceRatePopupBtn;
