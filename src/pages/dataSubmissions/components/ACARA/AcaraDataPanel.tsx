import ExplanationPanel from "../../../../components/ExplanationPanel";
import SchoolCensusDataSearchPanel, {
  iSchoolCensusDataSearchCriteria,
  LOCALSTORAGE_START_AND_END_NAME_ACARA
} from "../SchoolCensusData/SchoolCensusDataSearchPanel";
import React, { useEffect, useState } from "react";
import Toaster, { TOAST_TYPE_ERROR } from "../../../../services/Toaster";
import SynFileSemesterService from "../../../../services/Synergetic/SynFileSemesterService";
import * as _ from "lodash";
import { OP_OR } from "../../../../helper/ServiceHelper";
import iAcaraData from "./iAcaraData";
import AcaraDataList from "./AcaraDataList";
import AcaraDataHelper from "./AcaraDataHelper";
import SynVStudentService from "../../../../services/Synergetic/Student/SynVStudentService";
import SynLuLanguageService from "../../../../services/Synergetic/Lookup/SynLuLanguageService";
import SynLuOccupationPositionService from "../../../../services/Synergetic/Lookup/SynLuOccupationPositionService";
import { HEADER_NAME_SELECTING_FIELDS } from "../../../../services/AppService";
import SynVStudentParentService from "../../../../services/Synergetic/Student/SynVStudentParentService";
import iSynVStudentParent from "../../../../types/Synergetic/Community/iSynVStudentParent";
import SynCommunityService from "../../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../../types/Synergetic/iSynCommunity";
import { iVPastAndCurrentStudent } from "../../../../types/Synergetic/iVStudent";
import iSynLuLanguage from "../../../../types/Synergetic/Lookup/iSynLuLanguage";
import iSynLuQualificationLevel from "../../../../types/Synergetic/Lookup/iSynLuQualificationLevel";
import SynLuQualificationLevelService from "../../../../services/Synergetic/Lookup/SynLuQualificationLevelService";
import iSynOccupationPosition from "../../../../types/Synergetic/Lookup/iSynLuOccupationPosition";
import CSVExportBtn from "../../../../components/form/CSVExportBtn";
import AcaraDataExportHelper from "./AcaraDataExportHelper";
import {Dropdown} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons'
import styled from 'styled-components';

const ACARA_SCHOOL_ID = "46195";
const ACARA_SCHOOL_NAME = `Mentone Girls' Grammar School`;

const DropdownWrapper = styled.div`
  .dropdown-menu.show {
    .dropdown-item 
      .btn {
        width: 100%;
      }
    }
  }
`;
const AcaraDataPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [
    searchCriteria,
    setSearchCriteria
  ] = useState<iSchoolCensusDataSearchCriteria | null>(null);
  const [records, setRecords] = useState<iAcaraData[] | null>(null);

  useEffect(() => {
    if (searchCriteria === null) return;
    let isCanceled = false;

    const doSearch = async () => {
      const startEndDataString = {
        startDateStr: `${searchCriteria?.startDate || ""}`.trim(),
        endDateStr: `${searchCriteria?.endDate || ""}`.trim()
      };

      // get FileSemesters
      const {
        startDateFileSemesters,
        endDateFileSemesters
      } = await SynFileSemesterService.getFileSemesterFromStartAndEndDate(
        startEndDataString
      );
      const fileSemesters = _.uniqBy(
        [...startDateFileSemesters, ...endDateFileSemesters],
        record => `${record.FileYear}-${record.FileSemester}`
      );
      if (fileSemesters.length !== 1) {
        Toaster.showToast(`The Start Date and End Date!`, TOAST_TYPE_ERROR);
        return;
      }

      const [
        { data: students },
        languages,
        qualificationLevels,
        occupationPositions
      ] = await Promise.all([
        SynVStudentService.getVPastAndCurrentStudentAll(
          {
            where: JSON.stringify({
              StudentCampus: searchCriteria?.campusCodes,
              ...(fileSemesters.length === 1
                ? {
                    FileYear: fileSemesters[0].FileYear,
                    FileSemester: fileSemesters[0].FileSemester
                  }
                : {
                    [OP_OR]: fileSemesters.map(fileSemester => {
                      return {
                        FileYear: fileSemester.FileYear,
                        FileSemester: fileSemester.FileSemester
                      };
                    })
                  })
            }),
            sort:
              "StudentYearLevelSort:ASC,StudentGiven1:ASC,StudentSurname:ASC",
            perPage: 9999
          },
          {
            headers: {
              [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                "StudentID",
                "FileYear",
                "FileSemester",
                "StudentGiven1",
                "StudentSurname",
                "StudentYearLevel",
                "profileUrl",
                "StudentGender",
                "StudentBirthDate",
                "StudentCampus",
                "StudentEntryDate",
                "StudentLeavingDate",
                "FullFeeFlag",
                "StudentIsPastFlag",
                "StudentTSIFlag",
                "IndigenousFlag",
                "StudentHomeLanguageCode",
                "StudentHomeLanguageDescription"
              ])
            }
          }
        ),
        SynLuLanguageService.getAll({ perPage: 9999, sort: "ActiveFlag:ASC" }),
        SynLuQualificationLevelService.getAll({ perPage: 9999 }),
        SynLuOccupationPositionService.getAll({
          perPage: 9999,
          sort: "ActiveFlag:ASC"
        })
      ]);

      const studentIds = (students || []).map(record => record.StudentID);
      if (studentIds.length <= 0) {
        setRecords([]);
        return;
      }

      const languageMap = languages.reduce(
        (map, record) => ({ ...map, [record.Code]: record }),
        {}
      );
      const qualificationLevelMap = qualificationLevels.reduce(
        (map, record) => ({ ...map, [record.Code]: record }),
        {}
      );
      const occupationPositionMap = occupationPositions.reduce(
        (map, record) => ({ ...map, [record.Code]: record }),
        {}
      );

      // getParentInfo
      const { data: parents } = await SynVStudentParentService.getAll(
        {
          where: JSON.stringify({ ID: studentIds }),
          perPage: 99999
        },
        {
          headers: {
            [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              "ID",
              "Parent1ID",
              "Parent2ID"
            ])
          }
        }
      );
      const parentMap: { [key: number]: iSynVStudentParent } = {};
      const parentIds: string[] = [];
      for (const parent of parents) {
        parentMap[parent.ID] = parent;
        const parent1Id = `${parent.Parent1ID || ""}`.trim();
        const parent2Id = `${parent.Parent2ID || ""}`.trim();
        if (parent1Id !== "") {
          parentIds.push(parent1Id);
        }
        if (parent2Id !== "") {
          parentIds.push(parent2Id);
        }
      }

      const parentProfiles = (
        await Promise.all(
          _.chunk(_.uniq(parentIds), 100).map(ids => {
            return SynCommunityService.getCommunityProfiles(
              {
                where: JSON.stringify({ ID: ids }),
                perPage: 99999
              },
              {
                headers: {
                  [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                    "ID",
                    "NameInternal",
                    "HomeLanguageCode",
                    "HighestSecondaryYearLevel",
                    "OccupPositionCode",
                    "HighestQualificationLevel"
                  ])
                }
              }
            );
          })
        )
      ).reduce((arr: iSynCommunity[], res) => [...arr, ...res.data], []);

      const parentProfileMap = parentProfiles.reduce(
        (map, record) => ({ ...map, [record.ID]: record }),
        {}
      );

      const getParentInfo = (row: iVPastAndCurrentStudent, index: number) => {
        if (!(row.StudentID in parentMap)) {
          return {};
        }
        // @ts-ignore
        const parentId = `${parentMap[row.StudentID][`Parent${index}ID`] || ''}`.trim();

        const parentProfile =
          // @ts-ignore
          parentId in parentProfileMap ? parentProfileMap[parentId] : null;

        const highestSchoolEdu = AcaraDataHelper.translateHighestSchoolEdu(parentProfile?.HighestSecondaryYearLevel || "");

        const homeLanguage: iSynLuLanguage | null =
          parentProfile === null
            ? null
            : parentProfile.HomeLanguageCode in languageMap
            ? // @ts-ignore
              languageMap[parentProfile.HomeLanguageCode]
            : null;

        const parentMainSLG = AcaraDataHelper.translateLanguageCode(
          parentProfile?.HomeLanguageCode || ""
        );

        const qualificationLevel: iSynLuQualificationLevel | null =
          parentProfile === null
            ? null
            : parentProfile.HighestQualificationLevel in qualificationLevelMap
            ? // @ts-ignore
              qualificationLevelMap[parentProfile.HighestQualificationLevel]
            : null;
        const parentNonSchoolQL = AcaraDataHelper.translateQualificationLevel(
          parentProfile?.HighestQualificationLevel || ""
        );

        const occupationPosition: iSynOccupationPosition | null =
          parentProfile === null
            ? null
            : parentProfile.OccupPositionCode in occupationPositionMap
            ? // @ts-ignore
              occupationPositionMap[parentProfile.OccupPositionCode]
            : null;
        const parentOccGroup = AcaraDataHelper.translateOccupGroup(
          parentProfile?.OccupPositionCode || ""
        );

        return {
          [`parent${index}ID`]: parentId,
          // @ts-ignore
          [`parent${index}Name`]: parentId === '' ? '' : parentProfile?.NameInternal || "",

          [`parent${index}HighestSchoolEducation`]: parentId === '' ? '' : highestSchoolEdu,
          [`parent${index}HighestSchoolEducationCode`]: parentId === '' ? '' : (parentProfile?.HighestSecondaryYearLevel || ""),
          [`parent${index}HighestSchoolEducationValidFlag`]: parentId === '' ? '' : AcaraDataHelper.validateHighestSchoolEdu(highestSchoolEdu),

          [`parent${index}HomeLanguageCode`]: parentId === '' ? '' : homeLanguage?.Code || "",
          [`parent${index}HomeLanguageDescription`]: parentId === '' ? '' :
          homeLanguage?.Description || "",
          [`parent${index}MainSLG`]: parentId === '' ? '' : parentMainSLG,
          [`parent${index}MainSLGValidFlag`]: parentId === '' ? '' : AcaraDataHelper.validateLanguageCode(
            parentMainSLG
          ),

          [`parent${index}HighestNonSchoolEducation`]: parentId === '' ? '' : parentNonSchoolQL,
          [`parent${index}HighestNonSchoolEducationValidFlag`]: parentId === '' ? '' : AcaraDataHelper.validateQualificationLevel(
            parentNonSchoolQL
          ),
          [`parent${index}HighestNonSchoolEducationCode`]: parentId === '' ? '' :
          qualificationLevel?.Code || "",
          [`parent${index}HighestNonSchoolEducationDescription`]: parentId === '' ? '' :
          qualificationLevel?.Description || "",

          [`parent${index}OccupationGroup`]: parentId === '' ? '' : parentOccGroup,
          [`parent${index}OccupationGroupValidFlag`]: parentId === '' ? '' : AcaraDataHelper.validateOccupGroup(
            parentOccGroup
          ),
          [`parent${index}OccupationGroupCode`]: parentId === '' ? '' : occupationPosition?.Code || "",
          [`parent${index}OccupationGroupDescription`]: parentId === '' ? '' :
          occupationPosition?.Description || ""
        };
      };

      setRecords(
        // @ts-ignore
        _.uniqBy(
          (students || []).map(row => {
            const parent1Info = getParentInfo(row, 1);
            const parent2Info = getParentInfo(row, 2);
            const studentMainSLG = AcaraDataHelper.translateLanguageCode(
              row.StudentHomeLanguageCode
            );
            return {
              ID: row.StudentID,
              fileYear: row.FileYear,
              fileSemester: row.FileSemester,
              Given1: row.StudentGiven1,
              Surname: row.StudentSurname,
              sex: AcaraDataHelper.translateGender(row),
              gender: row.StudentGender,
              dateOfBirth: row.StudentBirthDate,
              campusCode: row.StudentCampus,
              entryDate: row.StudentEntryDate || "",
              leavingDate: `${row.StudentLeavingDate || ""}`.trim(),
              yearLevelCode: `${row.StudentYearLevel}`.trim(),
              isInternationalStudent: row.FullFeeFlag,
              isPastStudent: row.StudentIsPastFlag,
              ATSIStatus: AcaraDataHelper.translateATSIStatus(row),
              isTorresStraitIslander: row.StudentTSIFlag,
              isAboriginal: row.IndigenousFlag,

              studentMainSLGValidFlag: AcaraDataHelper.validateLanguageCode(
                studentMainSLG
              ),
              studentHomeLanguageCode: row.StudentHomeLanguageCode,
              studentHomeLanguageDescription:
                row.StudentHomeLanguageDescription,
              studentMainSLG: studentMainSLG,

              ...parent1Info,
              ...parent2Info
            };
          }),
          record => record.ID
        )
      );
    };

    setIsLoading(true);
    doSearch()
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [searchCriteria]);

  const getExportBtn = () => {
    if ((records || []).length === 0) {
      return null;
    }
    return (
      <DropdownWrapper>
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
                    resolve(records);
                  })
                }
                downloadFnc={() =>
                  AcaraDataExportHelper.genAcaraExcel(records || [], {
                    schoolId: ACARA_SCHOOL_ID,
                    schoolName: ACARA_SCHOOL_NAME
                  })
                }
                size={"sm"}
                variant={'success'}
                btnTxt={'Submission Data'}
              />
            </Dropdown.Item>
            <Dropdown.Item>
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() =>
                  new Promise(resolve => {
                    resolve(records);
                  })
                }
                downloadFnc={() =>
                  AcaraDataExportHelper.genSFOEExcel(records || [])
                }
                size={"sm"}
                variant={'info'}
                btnTxt={'Independent School / SFOE'}
              />
            </Dropdown.Item>
            <Dropdown.Item>
              <CSVExportBtn
                // @ts-ignore
                fetchingFnc={() =>
                  new Promise(resolve => {
                    resolve(records);
                  })
                }
                downloadFnc={() =>
                  AcaraDataExportHelper.genTotalExcel(records || [], {
                    schoolId: ACARA_SCHOOL_ID,
                    schoolName: ACARA_SCHOOL_NAME
                  })
                }
                btnTxt={'Raw Data'}
                size={"sm"}
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </DropdownWrapper>
    );
  };

  return (
    <div>
      <h5 className={"title"}>ACARA Report</h5>
      <ExplanationPanel
        variant={"info"}
        text={
          <>
            Data Submission: School ID(<b>{ACARA_SCHOOL_ID}</b>), School Name(
            <b>{ACARA_SCHOOL_NAME}</b>)
          </>
        }
      />

      <SchoolCensusDataSearchPanel
        localStartAndEndName={LOCALSTORAGE_START_AND_END_NAME_ACARA}
        isLoading={isLoading}
        searchFnc={criteria => setSearchCriteria(criteria)}
        btns={getExportBtn()}
      />

      <AcaraDataList isLoading={isLoading} records={records || []} />
    </div>
  );
};

export default AcaraDataPanel;
