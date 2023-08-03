import styled from "styled-components";
import { useEffect, useState } from "react";
import iVStaff from "../../types/Synergetic/iVStaff";
import SynVStaffService from "../../services/Synergetic/SynVStaffService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { iTableColumn } from "../common/Table";
import StaffListHelper, {
  iCommunitySkillMap,
  iPositionStaffIdMap,
  iStaffJobPositionMap,
  iStaffMap
} from "./components/StaffListHelper";
import SynStaffJobPositionService from "../../services/Synergetic/Staff/SynStaffJobPositionService";
import {
  OP_AND,
  OP_GTE,
  OP_LIKE,
  OP_LTE,
  OP_NOT,
  OP_OR
} from "../../helper/ServiceHelper";
import moment from "moment-timezone";
import SynCommunitySkillService from "../../services/Synergetic/Community/SynCommunitySkillService";
import SynLuSkillService from "../../services/Synergetic/Lookup/SynLuSkillService";
import StaffListSearchPanel, {
  iStaffListSearchCriteria
} from "./components/StaffListSearchPanel";
import SectionDiv from "../common/SectionDiv";
import UtilsService from "../../services/UtilsService";
import { FlexContainer } from "../../styles";
import ColumnPopupSelector, {
  getSelectedColumnsFromLocalStorage
} from "../common/ColumnPopupSelector";
import * as _ from "lodash";
import iSynStaffJobPosition from "../../types/Synergetic/Staff/iSynStaffJobPosition";
import iSynCommunitySkill from "../../types/Synergetic/Community/iSynCommunitySkill";
import { STORAGE_COLUMN_KEY_STAFF_LIST } from "../../services/LocalStorageService";
import CSVExportBtn from "../form/CSVExportBtn";
import iSynLuSkill from '../../types/Synergetic/Lookup/iSynLuSkill';
import StaffListTable from './components/StaffListTable';

const Wrapper = styled.div`
  .staff-list-table {
    max-height: calc(100vh - 11rem);
  }
`;

type iStaffListPanel = {
  showSearchPanel?: boolean;
};

const CHUNK_SIZE = 100;

const StaffListPanel = ({ showSearchPanel = true }: iStaffListPanel) => {
  const [staffList, setStaffList] = useState<iVStaff[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState<iTableColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn[]>([]);
  const [skills, setSkills] = useState<iSynLuSkill[]>([]);
  const [staffJobPosMap, setStaffJobPosMap] = useState<iStaffJobPositionMap>({});
  const [skillsMap, setSkillsMap] = useState<iCommunitySkillMap>({});
  const [staffMap, setStaffMap] = useState<iStaffMap>({});
  const [positionStaffIdMap, setPositionStaffIdMap] = useState<iPositionStaffIdMap>({});
  const [searchCriteria, setSearchCriteria] = useState<
    iStaffListSearchCriteria
  >({});

  const doSearch = async (criteria: iStaffListSearchCriteria) => {
    const { ActiveFlag, SearchTxt, DepartmentCodes, CategoryCodes } = criteria;
    const [staffs, skills] = await Promise.all([
      SynVStaffService.getStaffList({
        where: JSON.stringify({
          ...(ActiveFlag === undefined ||
          ActiveFlag === null ||
          `${ActiveFlag}`.trim() === ""
            ? {}
            : { ActiveFlag }),
          ...(`${SearchTxt || ""}`.trim() === ""
            ? {}
            : UtilsService.isNumeric(`${SearchTxt || ""}`.trim())
            ? { StaffID: `${SearchTxt || ""}`.trim() }
            : {
                StaffNameInternal: {
                  [OP_LIKE]: `%${`${SearchTxt || ""}`.trim()}%`
                }
              }),
          ...((DepartmentCodes || []).length > 0
            ? { StaffDepartment: DepartmentCodes }
            : {}),
          ...((CategoryCodes || []).length > 0
            ? { StaffCategory: CategoryCodes }
            : {})
        })
      }),
      SynLuSkillService.getAll()
    ]);
    const luSkills = skills.filter(
      skill => `${skill.Code || ""}`.trim() !== ""
    );
    const originOb = {
      staffs,
      luSkills,
      staffJobPositions: [],
      communitySkills: []
    };
    if (staffs.length < 0) {
      return originOb;
    }
    const staffMap = staffs.reduce((map, staff) => {
      return {
        ...map,
        [staff.StaffID]: staff
      };
    }, {});

    const staffJobPositionArr = await Promise.all(
      _.chunk(Object.keys(staffMap), CHUNK_SIZE).map(ids => {
        return SynStaffJobPositionService.getAll({
          where: JSON.stringify({
            JobPositionsSeq: { [OP_NOT]: null },
            ID: ids,
            [OP_AND]: [
              {
                [OP_OR]: [
                  { StartDate: null },
                  {
                    StartDate: {
                      [OP_LTE]: moment().format(`YYYY-MM-DD HH:mm:ss`)
                    }
                  }
                ]
              },
              {
                [OP_OR]: [
                  { EndDate: null },
                  {
                    EndDate: {
                      [OP_GTE]: moment().format(`YYYY-MM-DD HH:mm:ss`)
                    }
                  }
                ]
              }
            ]
          }),
          include:
            "SynJobPosition.ReportsToJobPosition,OverrideReportsToJobPosition",
          perPage: 99999
        });
      })
    );
    const staffJobPositions = staffJobPositionArr.reduce(
      (arr: iSynStaffJobPosition[], staffJobPositionA) => [
        ...arr,
        ...(staffJobPositionA.data || [])
      ],
      []
    );
    if (staffJobPositions.length <= 0) {
      return originOb;
    }

    const communitySkillsArr = await Promise.all(
      _.chunk(Object.keys(staffMap), CHUNK_SIZE).map(ids => {
        return SynCommunitySkillService.getAll({
          where: JSON.stringify({
            ID: ids
          }),
          perPage: 99999
        });
      })
    );
    const communitySkills = communitySkillsArr.reduce(
      (arr: iSynCommunitySkill[], communitySkillsA) => [
        ...arr,
        ...(communitySkillsA.data || [])
      ],
      []
    );
    return {
      ...originOb,
      staffJobPositions,
      communitySkills
    };
  };

  useEffect(() => {
    if (Object.keys(searchCriteria).length <= 0) {
      return;
    }
    let isCanceled = false;
    setIsLoading(true);

    doSearch(searchCriteria)
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const { luSkills, staffs, staffJobPositions, communitySkills } = resp;
        const sJobPosMap = (staffJobPositions || []).reduce(
          (map, staffJobPos) => {
            const key = staffJobPos.ID;
            return {
              ...map,
              // @ts-ignore
              [key]: [...(key in map ? map[key] : []), staffJobPos]
            };
          },
          {}
        );
        const posStaffMap = (staffJobPositions || []).reduce(
          (map, staffJobPos) => {
            const key = `${staffJobPos.SynJobPosition?.JobPositionsSeq ||
              ""}`.trim();
            if (key === "") {
              return map;
            }
            const keyNumber = Number(key);
            return {
              ...map,
              [keyNumber]: [
                // @ts-ignore
                ...(keyNumber in map ? map[keyNumber] : []),
                staffJobPos.ID
              ]
            };
          },
          {}
        );
        const sSkillMap = communitySkills.reduce((map, communitySkill) => {
          const key = communitySkill.ID;
          return {
            ...map,
            // @ts-ignore
            [key]: [...(key in map ? map[key] : []), communitySkill]
          };
        }, {});
        const sfMap = staffs.reduce((map, staff) => {
          return {
            ...map,
            [staff.StaffID]: staff
          };
        }, {});
        const columns = StaffListHelper.getListColumns({
          luSkills,
          staffJobPosMap: sJobPosMap,
          skillMap: sSkillMap,
          staffMap: sfMap,
          positionStaffIdMap: posStaffMap
        });

        const selectedCols = getSelectedColumnsFromLocalStorage(
          STORAGE_COLUMN_KEY_STAFF_LIST,
          columns
        );
        setSelectedColumns(
          selectedCols.length > 0
            ? selectedCols
            : columns.filter(column => column.isDefault === true)
        );

        setColumns(columns);
        setStaffList(Object.values(sfMap));
        setSkills(luSkills);
        setStaffJobPosMap(sJobPosMap);
        setSkillsMap(sSkillMap);
        setStaffMap(sfMap);
        setPositionStaffIdMap(posStaffMap);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCanceled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCriteria]);

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }
    if (staffList === null) {
      return null;
    }

    return (
      <>
        <FlexContainer className={"justify-content-between"}>
          <h5>{staffList?.length || 0} Staff</h5>
          <FlexContainer className={"with-gap"}>
            <CSVExportBtn
              // @ts-ignore
              fetchingFnc={() =>
                new Promise(resolve => {
                  resolve(staffList);
                })
              }
              downloadFnc={() =>
                StaffListHelper.genExportFile(selectedColumns, staffList, {
                  luSkills: skills,
                  staffJobPosMap: staffJobPosMap,
                  skillMap: skillsMap,
                  staffMap,
                  positionStaffIdMap: positionStaffIdMap
                })
              }
              variant={"link"}
              size={"sm"}
            />
            <ColumnPopupSelector
              localStorageKey={STORAGE_COLUMN_KEY_STAFF_LIST}
              columns={columns}
              selectedColumns={selectedColumns}
              size={"sm"}
              onColumnSelected={cols => setSelectedColumns(cols)}
            />
          </FlexContainer>
        </FlexContainer>
        <StaffListTable
          staffList={staffList}
          selectedColumns={selectedColumns}
          staffJobPosMap={staffJobPosMap}
          luSkills={skills}
          skillMap={skillsMap}
          staffMap={staffMap}
          positionStaffIdMap={positionStaffIdMap}
        />
      </>
    );
  };

  return (
    <Wrapper>
      {showSearchPanel === true ? (
        <StaffListSearchPanel
          isSearching={isLoading}
          onReset={() => {
            setStaffList(null);
            setSearchCriteria({});
          }}
          onSearch={criteria => setSearchCriteria(criteria)}
          selectedSearchCriteria={searchCriteria || undefined}
        />
      ) : null}
      <SectionDiv>{getContent()}</SectionDiv>
    </Wrapper>
  );
};

export default StaffListPanel;
