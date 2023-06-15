import ExplanationPanel from '../../../../components/ExplanationPanel';
import SchoolCensusDataSearchPanel, {
  iSchoolCensusDataSearchCriteria, LOCALSTORAGE_START_AND_END_NAME_ACARA
} from '../SchoolCensusData/SchoolCensusDataSearchPanel';
import React, {useEffect, useState} from 'react';
import Toaster, {TOAST_TYPE_ERROR} from '../../../../services/Toaster';
import SynFileSemesterService from '../../../../services/Synergetic/SynFileSemesterService';
import * as _ from 'lodash';
import SynVStudentService from '../../../../services/Synergetic/SynVStudentService';
import {OP_OR} from '../../../../helper/ServiceHelper';
import iAcaraData from './iAcaraData';
import AcaraDataList from './AcaraDataList';
import AcaraDataHelper from './AcaraDataHelper';

const AcaraDataPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<iSchoolCensusDataSearchCriteria | null>(null);
  const [records, setRecords] = useState<iAcaraData[] | null>(null);

  useEffect(() => {
    if (searchCriteria === null) return;
    let isCanceled = false;

    const doSearch = async () => {
      const startEndDataString = {
        startDateStr: `${searchCriteria?.startDate || ''}`.trim(),
        endDateStr: `${searchCriteria?.endDate || ''}`.trim()
      }
      const { startDateFileSemesters, endDateFileSemesters, } = await SynFileSemesterService.getFileSemesterFromStartAndEndDate(startEndDataString);
      const fileSemesters = _.uniqBy([...startDateFileSemesters, ...endDateFileSemesters], (record) => `${record.FileYear}-${record.FileSemester}`);
      if (fileSemesters.length !== 1) {
        Toaster.showToast(`The Start Date and End Date!`, TOAST_TYPE_ERROR);
        return;
      }

      const resp = await SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          StudentCampus: searchCriteria?.campusCodes,
          ...(fileSemesters.length === 1 ? {FileYear: fileSemesters[0].FileYear, FileSemester: fileSemesters[0].FileSemester} : {
            [OP_OR]: fileSemesters.map(fileSemester => {
              return {FileYear: fileSemester.FileYear, FileSemester: fileSemester.FileSemester};
            })
          }),
        }),
        sort: 'StudentYearLevelSort:ASC,StudentGiven1:ASC,StudentSurname:ASC',
        perPage: 9999,
      })

      setRecords(_.uniqBy(
        (resp.data || [])
          .map(row => ({
            ID: row.ID,
            fileYear: row.FileYear,
            fileSemester: row.FileSemester,
            Given1: row.StudentGiven1,
            Surname: row.StudentSurname,
            gender: AcaraDataHelper.translateGender(row),
            dateOfBirth: row.StudentBirthDate,
            studentStatus: row.StudentStatus,
            StudentStatusDescription: row.StudentStatusDescription,
            campusCode: row.StudentCampus,
            entryDate: row.StudentEntryDate,
            leavingDate: `${row.StudentLeavingDate || ''}`.trim(),
            yearLevelCode: `${row.StudentYearLevel}`.trim(),
            isInternationalStudent: row.FullFeeFlag,
            isPastStudent: row.StudentIsPastFlag,
            ATSIStatus: AcaraDataHelper.translateATSIStatus(row),
          })),
        (record) => record.ID
      ))
    }

    setIsLoading(true)
    doSearch()
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false)
      })

    return () => {
      isCanceled = true;
    }
  }, [searchCriteria])

  const getExportBtn = () => {
    return null;
  }

  return (
    <div>
      <h5 className={'title'}>ACARA Report</h5>
      <ExplanationPanel
        variant={'info'}
        text={
          <div></div>
        }
      />

      <SchoolCensusDataSearchPanel
        localStartAndEndName={LOCALSTORAGE_START_AND_END_NAME_ACARA}
        isLoading={isLoading}
        searchFnc={(criteria) => setSearchCriteria(criteria)}
        btns={getExportBtn()}
      />

      <AcaraDataList
        isLoading={isLoading}
        records={records || []}
        schoolId={'46195'}
        schoolName={'Mentone Girls\' Grammar School'}
      />
    </div>
  )
}

export default AcaraDataPanel;
