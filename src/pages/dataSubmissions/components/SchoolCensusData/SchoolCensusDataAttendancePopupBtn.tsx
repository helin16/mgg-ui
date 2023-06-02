import {ButtonProps, Spinner, Table} from 'react-bootstrap';
import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import PopupModal from '../../../../components/common/PopupModal';
import {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import SynVAttendanceService from '../../../../services/Synergetic/Attendance/SynVAttendanceService';
import {OP_BETWEEN} from '../../../../helper/ServiceHelper';
import Toaster from '../../../../services/Toaster';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import iSynVAttendance from '../../../../types/Synergetic/Attendance/iSynVAttendance';
import {FlexContainer} from '../../../../styles';
import CSVExportBtn from '../../../../components/form/CSVExportBtn';
import * as XLSX from 'sheetjs-style';
import SchoolCensusDataExportHelper from './SchoolCensusDataExportHelper';
import * as _ from 'lodash';

type iSchoolCensusDataAttendancePopupBtn = ButtonProps & {
  popupTitle: any;
  schoolDays: string[];
  studentIds: number[];
  unfilteredStudentRecords: iSchoolCensusStudentData[];
  startAndEndDateString: iStartAndEndDateString;
}

const PopupWrapper = styled.div`
  .date-selector-wrapper {
    width: 48%;
  }
`;
const SchoolCensusDataAttendancePopupBtn = ({popupTitle, schoolDays, studentIds, unfilteredStudentRecords, startAndEndDateString, ...rest}: iSchoolCensusDataAttendancePopupBtn) => {

  const [isSearching, setIsSearching ] = useState(false);
  const [records, setRecords ] = useState<(iSynVAttendance & {Student: iSchoolCensusStudentData})[]>([]);
  const [showingSearchPopup, setShowingSearchPopup ] = useState(false);

  useEffect(() => {
    if (!showingSearchPopup) { return }
    let isCanceled = false;

    setIsSearching(true);
    SynVAttendanceService.getAll({
      where: JSON.stringify({
        ClassCancelledFlag: false,
        AttendedFlag: true,
        ID: studentIds,
        AttendanceDate: {[OP_BETWEEN]: [startAndEndDateString.startDateStr, startAndEndDateString.endDateStr]},
      }),
      perPage: 999999,
    }).then(resp => {
      if (isCanceled) { return; }

      const studentMap = unfilteredStudentRecords.reduce((map, record) => {
        return ({
          ...map,
          [record.ID]: record,
        })
      }, {});
      setRecords((resp.data || []).map(record => {
        return ({
          ...record,
          // @ts-ignore
          Student: record.ID in studentMap ? studentMap[record.ID] : null,
        })
      }))
    }).catch(err => {
      if (isCanceled) { return; }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return; }
      setIsSearching(false);
    })

    return () => {
      isCanceled = true;
    }

  }, [unfilteredStudentRecords, showingSearchPopup, startAndEndDateString, studentIds]);

  const handleClose = () => {
    if (isSearching) {
      return;
    }
    setShowingSearchPopup(false)
  }


  const getResultTable = () => {
    if (isSearching) {
      return <PageLoadingSpinner />
    }
    return (
      <Table striped hover>
        <thead>
          <tr>
            <th>Student</th>
            <th>Year Lvl.</th>
            <th>Year Gen</th>
            <th>D.O.B.</th>
            <th>Age</th>
            <th>Inter?</th>
            <th>Ind.?</th>
            <th>Status</th>
            <th>Entry Date</th>
            <th>Left Date</th>
            <th>Attendance Date</th>
            <th>Class Code</th>
          </tr>
        </thead>
        <tbody>
        {records.map((record, index) => {
          return (
            <tr key={index}>
              <td>
                <div>[{record.Student.ID}]</div>
                {record.Student.Surname}, {record.Student.Given1}
              </td>
              <td>{record.Student.yearLevelCode}</td>
              <td>{record.Student.gender}</td>
              <td>{moment(record.Student.dateOfBirth).format('DD MMM YYYY')}</td>
              <td>{record.Student.age}</td>
              <td>{record.Student.isInternationalStudent === true ? 'Y' : ''}</td>
              <td>{record.Student.isIndigenous === true ? 'Y' : ''}</td>
              <td>
                <div>{record.Student.StudentStatusDescription}</div>
                {record.Student.isPastStudent === true ? <small>[PAST]</small> : ''}
              </td>
              <td>{moment(record.Student.entryDate).format('DD MMM YYYY')}</td>
              <td>{`${record.Student.leavingDate || ''}`.trim() === '' ? '' : moment(record.Student.leavingDate).format('DD MMM YYYY')}</td>
              <td>
                {moment(record.AttendanceDate).format('DD MMM YYYY')}
              </td>
              <td>
                {record.ClassCode}
              </td>
            </tr>
          )
        })}
        </tbody>
      </Table>
    );
  }

  const genCSVFile = () => {
    const titleRows = SchoolCensusDataExportHelper.getAttendanceTitleRows();
    const rows = records.map(record => SchoolCensusDataExportHelper.getAttendanceCSVRow(record));
    // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
    const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
    XLSX.writeFile(wb, `Attendance_export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
  }

  const getSearchPopup = () => {
    return (
      <PopupModal
        dialogClassName={'modal-90w'}
        size={'lg'}
        show={showingSearchPopup}
        handleClose={() => handleClose()}
        title={
          <>
            <FlexContainer className={'with-gap lg-gap'}>
              ({_.uniq(records.map(record => record.ID)).length}) {popupTitle}
              {isSearching === true ? <Spinner animation={'border'} /> : <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() => new Promise(resolve => {
                  resolve(records)
                })}
                downloadFnc={genCSVFile}
                size={'sm'}
                variant={'link'}
              />}
            </FlexContainer>
          </>
        }
      >
        <PopupWrapper>
          {getResultTable()}
        </PopupWrapper>
      </PopupModal>
    )
  }

  return (
    <>
      <LoadingBtn {...rest} onClick={() => setShowingSearchPopup(true)} isLoading={isSearching}/>
      {getSearchPopup()}
    </>
  )
}

export default SchoolCensusDataAttendancePopupBtn;
