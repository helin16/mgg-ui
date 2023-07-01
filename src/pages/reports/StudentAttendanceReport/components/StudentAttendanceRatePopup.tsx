import {Button, ButtonProps, Dropdown, Table} from 'react-bootstrap';
import {iVPastAndCurrentStudent} from '../../../../types/Synergetic/iVStudent';
import {iAttendanceMap} from './StudentAttendanceRateReportTable';
import React, {useState} from 'react';
import PopupModal from '../../../../components/common/PopupModal';
import moment from 'moment-timezone';
import styled from 'styled-components';
import {FlexContainer} from '../../../../styles';
import * as Icons from 'react-bootstrap-icons'
import iSynVStudentAttendanceHistory from '../../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory';
import MathHelper from '../../../../helper/MathHelper';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import StudentAttendanceRateDownloadHelper from './StudentAttendanceRateDownloadHelper';

type iStudentAttendanceRatePopup = ButtonProps & {
  watchingRate: number;
  showingStudentIds: number[];
  studentMap: { [key: number]: iVPastAndCurrentStudent };
  attendanceRecordMap: iAttendanceMap;
  attendanceRateMap: { [key: number]: number };
}
const Wrapper = styled.div`
  th,
  td {
    padding: 2px;
  }
  
  .rate.bg-danger.text-white {
    .btn {
      color: white !important;
    }
  }
`;
const ExportDropdownWrapper = styled.div`
  .btn {
    width: 100%;
  }
`;

const SHOWING_DETAILS_TYPE_ALL = 'all';
const SHOWING_DETAILS_TYPE_ATTENDED = 'attended';
const SHOWING_DETAILS_TYPE_NOT_ATTENDED = 'not attended';
const StudentAttendanceRatePopup = ({watchingRate, showingStudentIds, studentMap, attendanceRecordMap, attendanceRateMap, ...props}: iStudentAttendanceRatePopup) => {

  const [showingPopup, setShowingPopup] = useState(false);
  const [showingDetails, setShowingDetails] = useState<iVPastAndCurrentStudent | null>(null);
  const [showingDetailsType, setShowingDetailsType] = useState(SHOWING_DETAILS_TYPE_ALL);

  const handleClose = () => {
    setShowingPopup(false);
    setShowingDetails(null);
    setShowingDetailsType(SHOWING_DETAILS_TYPE_ALL);
  }

  const getSelectedStudents = () => {
    return showingStudentIds
      .map(id => id in studentMap ? {...studentMap[id], attendanceRate: attendanceRateMap[id]} : null)
      .filter(std => std !== null)
      .sort((r1, r2) => (r1?.attendanceRate || 0) > (r2?.attendanceRate || 0) ? 1 : -1)
  }

  const getExportBtn = () => {
    return (
      <ExportDropdownWrapper>
        <Dropdown>
          <Dropdown.Toggle size={'sm'}>
            <Icons.Download /> {' '} Export
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() =>
                  new Promise(resolve => {
                    resolve(null);
                  })
                }
                downloadFnc={() =>
                  StudentAttendanceRateDownloadHelper.downloadStudentsWithRate(getSelectedStudents())
                }
                size={"sm"}
                variant={'link'}
                btnTxt={'Attendance Rates'}
              />
            </Dropdown.Item>
            <Dropdown.Item>
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() =>
                  new Promise(resolve => {
                    resolve(null);
                  })
                }
                downloadFnc={() =>
                  // @ts-ignore
                  StudentAttendanceRateDownloadHelper.downloadStudentsAttendanceRecords(getSelectedStudents(), attendanceRecordMap )
                }
                size={"sm"}
                variant={'link'}
                btnTxt={'Attendance Record / Details'}
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ExportDropdownWrapper>
    );
  };

  const getPopupTitle = () => {
    if (showingDetails) {
      return (
        <FlexContainer className={'with-gap lg-gap'}>
          <FlexContainer className={'with-gap'}>
            <Button variant={'link'} size={'sm'} onClick={() => setShowingDetails(null)}>
              <Icons.ArrowLeft/>
            </Button>
            <div>
              Attendances for <small><u>{showingDetails.StudentNameExternal}</u> [{showingDetails.StudentID}] {showingDetails.StudentForm}</small>:
            </div>
            <div style={{marginLeft: '1rem'}}>{
              // @ts-ignore
              'attendanceRate' in showingDetails ? `${Number(showingDetails.attendanceRate || 0).toFixed(2)} %` : ''
            }
            </div>
          </FlexContainer>
          <div>
            <CSVExportBtn
              // @ts-ignore
              fetchingFnc={() =>
                new Promise(resolve => {
                  resolve(null);
                })
              }
              downloadFnc={() =>
                // @ts-ignore
                StudentAttendanceRateDownloadHelper.downloadStudentsAttendanceRecords([showingDetails], attendanceRecordMap )
              }
              size={"sm"}
              variant={'primary'}
              btnTxt={'Attendance Record / Details'}
            />
          </div>
        </FlexContainer>
      );
    }
    return (
      <FlexContainer className={'with-gap lg-gap align-items end'}>
        <h4 style={{margin: '0px'}}>{showingStudentIds.length} student(s):</h4>
        {getExportBtn()}
      </FlexContainer>
    );
  }

  const getPopupContent = () => {
    if (showingDetails) {
      const attendanceRecords = (showingDetails.StudentID in attendanceRecordMap ? attendanceRecordMap[showingDetails.StudentID] : []);
      const attended = attendanceRecords.filter(record => record.AttendedFlag === true).length;
      const notAttended = attendanceRecords.filter(record => record.AttendedFlag !== true).length;
      return (
        <>
          <FlexContainer className={'space-below justify-content space-between align-items end'}>
            <h6>List of records for: {showingDetailsType}</h6>
            <FlexContainer className={'with-gap lg-gap'}>
              <div className={'text-center'}>
                <b className={'text-muted'}>Total</b>
                <Button variant={'link'} size={'sm'} onClick={() => setShowingDetailsType(SHOWING_DETAILS_TYPE_ALL)}>{attendanceRecords.length}</Button>
              </div>
              <div className={'text-center'}>
                <b className={'text-muted'}>Attended</b>
                <Button variant={'link'} size={'sm'} onClick={() => setShowingDetailsType(SHOWING_DETAILS_TYPE_ATTENDED)}>{attended}</Button>
              </div>
              <div className={'text-center'}>
                <b className={'text-muted'}>Not Attended</b>
                <Button variant={'link'} size={'sm'} onClick={() => setShowingDetailsType(SHOWING_DETAILS_TYPE_NOT_ATTENDED)}>{notAttended}</Button>
              </div>
            </FlexContainer>
          </FlexContainer>

          <Table hover striped>
            <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Period</th>
              <th>Class Code</th>
              <th>Attended</th>
              <th>Possible Absence Code</th>
              <th>Possible Reason Code</th>
              <th>Possible Reason</th>
            </tr>
            </thead>
            <tbody>
            {attendanceRecords.filter(record => {
              if (showingDetailsType === SHOWING_DETAILS_TYPE_ATTENDED && record.AttendedFlag !== true) {
                return false;
              }
              if (showingDetailsType === SHOWING_DETAILS_TYPE_NOT_ATTENDED && record.AttendedFlag === true) {
                return false;
              }

              return true;
            })
              .map((record: iSynVStudentAttendanceHistory, index) => {
                if (!record) { return null;}
                return (
                  <tr key={index}>
                    <td>{MathHelper.add(index, 1)}</td>
                    <td>{`${record.AttendanceDate || ''}`.trim() !== '' ? moment(`${record.AttendanceDate || ''}`.trim()).format('DD MMM YYYY  ddd') : ''}</td>
                    <td>{'AttendancePeriod' in record ? record.AttendancePeriod : ''}</td>
                    <td>{'ClassCode' in record ? record.ClassCode : ''}</td>
                    <td>{'AttendedFlag' in record ? (record.AttendedFlag ? 'Y' : '') : ''}</td>
                    <td>{'PossibleAbsenceCode' in record ? record.PossibleAbsenceCode : ''}</td>
                    <td>{'PossibleReasonCode' in record ? record.PossibleReasonCode : ''}</td>
                    <td>{'PossibleDescription' in record ? record.PossibleDescription : ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      )
    }
    return (
      <Table hover striped>
        <thead>
        <tr>
          <th>ID</th>
          <th>Student</th>
          <th>Year Level</th>
          <th>Form</th>
          <th>Status</th>
          <th>Leaving/Left Date</th>
          <th>isPast?</th>
          <th>Attendance Rate (%)</th>
        </tr>
        </thead>
        <tbody>
        {getSelectedStudents()
          .map((record: iVPastAndCurrentStudent | null, index) => {
            if (!record) { return null;}
            return (
              <tr key={index}>
                <td>{'StudentID' in record ? record.StudentID : ''}</td>
                <td>{'StudentNameExternal' in record ? record.StudentNameExternal : ''}</td>
                <td>{'StudentYearLevel' in record ? record.StudentYearLevel : ''}</td>
                <td>{'StudentForm' in record ? record.StudentForm : ''}</td>
                <td>{'StudentStatusDescription' in record ? record.StudentStatusDescription : ''}</td>
                <td>{`${record.StudentLeavingDate || ''}`.trim() !== '' ? moment(`${record.StudentLeavingDate || ''}`.trim()).format('DD MMM YYYY') : ''}</td>
                <td>{'StudentIsPastFlag' in record ? (record.StudentIsPastFlag ? 'Y' : '') : ''}</td>
                {/*// @ts-ignore*/}
                <td className={`rate ${Number(record.attendanceRate || 0) < watchingRate ? 'bg-danger text-white' : ''}`}>
                  <Button variant={'link'} size={'sm'} onClick={() => setShowingDetails(record)}>
                    {
                      // @ts-ignore
                      'attendanceRate' in record ? `${Number(record.attendanceRate || 0).toFixed(2)}` : ''
                    }
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }

  return (
    <>
      <Button {...props} onClick={() => setShowingPopup(true)}/>
      <PopupModal
        dialogClassName={'modal-80w'}
        show={showingPopup}
        handleClose={handleClose}
        title={getPopupTitle()}
      >
        <Wrapper>{getPopupContent()}</Wrapper>
      </PopupModal>
    </>
  );
}

export default StudentAttendanceRatePopup;
