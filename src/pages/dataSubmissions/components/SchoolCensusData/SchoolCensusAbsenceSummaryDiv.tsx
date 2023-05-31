import iSchoolCensusStudentData, {iStartAndEndDateString} from './iSchoolCensusStudentData';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';
import {useEffect, useState} from 'react';
// import styled from 'styled-components';
import moment from 'moment-timezone';
import SynVAbsenceService from '../../../../services/Synergetic/Absence/SynVAbsenceService';
import {OP_GTE, OP_LTE} from '../../../../helper/ServiceHelper';
import Toaster from '../../../../services/Toaster';
import {Spinner, Table} from 'react-bootstrap';
import SynFileSemesterService from '../../../../services/Synergetic/SynFileSemesterService';

type iSchoolCensusDataSummaryDiv = {
  className?: string;
  size?: string;
  schoolDays: string[];
  unfilteredStudentRecords: iSchoolCensusStudentData[];
  startAndEndDateString: iStartAndEndDateString;
};

// const Wrapper = styled.div``;
const SchoolCensusAbsenceSummaryDiv = ({size, className, unfilteredStudentRecords, schoolDays, startAndEndDateString}: iSchoolCensusDataSummaryDiv) => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<iSchoolCensusStudentData[]>([]);

  useEffect(() => {
    let isCanceled = false;

    const getFileSemesters = ({ startDateStr,  endDateStr, }:iStartAndEndDateString  ) => {
      return SynFileSemesterService.getFileSemesters({
        where: JSON.stringify({
          ActivatedFlag: true,
          StartDate: {[OP_LTE]: startDateStr},
          EndDate: {[OP_GTE]: endDateStr},
        }),
        perPage: 1
      });
    }

    const getData = async () => {
      const fileSemesters = await getFileSemesters(startAndEndDateString);
      // the date range is not with any FileSemester, then return 0 as there is no school days
      if (fileSemesters.length === 0) {
        setRecords([]);
        return;
      }

      if(schoolDays.length === 0) {
        setRecords([]);
        return;
      }
      const studentAbsences = await SynVAbsenceService.getAll({
        where: JSON.stringify({
          SynergyMeaning: 'AllDayAbsence',
          ID: unfilteredStudentRecords.map(rec => rec.ID),
          AbsenceDate: schoolDays.map(schoolDay => `${schoolDay}T00:00:00Z`),
        }),
        include: 'SynLuAbsenceType',
        perPage: 999999,
      });
      const studentAbsencesMap = (studentAbsences.data || [])
        .filter(absence => absence.SynLuAbsenceType?.CountAsAbsenceFlag === true)
        .reduce((map, absence)=> {
        return {
          ...map,
          [absence.ID]: {
            // @ts-ignore
            ...(absence.ID in map ? map[absence.ID] : {}),
            [`${moment(absence.AbsenceDate).format('YYYY-MM-DD')}`]: absence,
          }
        }
      }, {});

      const totalAbsenceMap = {};
      for(const studentID of Object.keys(studentAbsencesMap)) {
        // @ts-ignore
        if (Object.keys(studentAbsencesMap[studentID]).length === schoolDays.length) {
          // @ts-ignore
          totalAbsenceMap[studentID] = studentAbsencesMap[studentID];
        }
      }
      if (Object.keys(totalAbsenceMap).length === 0) {
        setRecords([]);
        return;
      }

      setRecords(
        unfilteredStudentRecords
          .filter(record => Object.keys(totalAbsenceMap).indexOf(`${record.ID}`) >= 0 )
          .map(record => {
            return ({
              ...record,
              // @ts-ignore
              extra: `${record.ID}` in totalAbsenceMap ? totalAbsenceMap[`${record.ID}`] : [],
            })
          })
      )
    }

    setIsLoading(true);
    getData()
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      }).finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [unfilteredStudentRecords, startAndEndDateString, schoolDays]);


  const getExtraCol = (isTitleRow: boolean, record?: iSchoolCensusStudentData) => {
    if (isTitleRow === true) {
      return <>Absence(s)</>
    }
    const absenceMap = record?.extra || {};
    console.log('absenceMap', absenceMap);
    return (
      <Table>
        <tbody>
          {Object.keys(absenceMap).map(date => {
            return (
              <tr key={date}
              >
                <td>{moment(date).format('DD MMM YYYY ddd')}</td>
                <td>{absenceMap[date].SynLuAbsenceType.Description}</td>
                <td>{absenceMap[date].SynergyMeaning}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }


  return (
    <SchoolCensusDataPopupBtn
      disabled={isLoading}
      popupTitle={
        <>
          <h4>{records.length} student{records.length > 1 ? 's' : ''}</h4>
          <small className={'text-muted text-size-14'}>
            who {records.length > 1 ? 'are' : 'is'} absent the entire period: <u>{moment(startAndEndDateString.startDateStr).format('DD MMM YYYY')}</u> to <u>{moment(startAndEndDateString.endDateStr).format('DD MMM YYYY')}</u>
          </small>
        </>
      }
      records={records}
      className={className}
      // @ts-ignore
      size={size}
      showExtraFn={getExtraCol}
    >
      {isLoading ? <Spinner animation={'border'} /> : (
        <>
          <h5>Absences</h5>
          <div>{records.length}</div>
        </>
      )}

    </SchoolCensusDataPopupBtn>
  )
}

export default SchoolCensusAbsenceSummaryDiv;
