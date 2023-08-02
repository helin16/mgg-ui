import styled from "styled-components";
import { useEffect, useState } from "react";
import iVStaff from "../../types/Synergetic/iVStaff";
import SynVStaffService from "../../services/Synergetic/SynVStaffService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import Table, { iTableColumn } from "../common/Table";
import StaffListHelper from "./StaffListHelper";
import SynStaffJobPositionService from "../../services/Synergetic/Staff/SynStaffJobPositionService";
import {
  OP_AND,
  OP_GTE, OP_LIKE,
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
import SectionDiv from '../common/SectionDiv';
import UtilsService from '../../services/UtilsService';
import {FlexContainer} from '../../styles';
import ColumnPopupSelector from '../common/ColumnPopupSelector';

const Wrapper = styled.div`
  .job-pos-col {
    div {
      border-top: 1px #ccc solid;
      &:first-child {
        border-top: none;
      }
    }
  }
`;

type iStaffListPanel = {
  showSearchPanel?: boolean;
};
const StaffListPanel = ({ showSearchPanel = true }: iStaffListPanel) => {
  const [staffList, setStaffList] = useState<iVStaff[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState<iTableColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<
    iStaffListSearchCriteria
  >({});


  const doSearch = async (criteria: iStaffListSearchCriteria) => {
    const {ActiveFlag, SearchTxt, DepartmentCodes, CategoryCodes} = criteria;
    const [staffs, skills] = await Promise.all([
      SynVStaffService.getStaffList({
        where: JSON.stringify({
          ...((ActiveFlag === undefined || ActiveFlag === null || `${ActiveFlag}`.trim() === '') ? {} : {ActiveFlag}),
          ...(`${SearchTxt || ''}`.trim() === '' ? {} : (UtilsService.isNumeric(`${SearchTxt || ''}`.trim()) ? {StaffID: `${SearchTxt || ''}`.trim()} : { StaffNameInternal: {[OP_LIKE] : `%${`${SearchTxt || ''}`.trim()}%`}})),
          ...((DepartmentCodes || []).length > 0 ? {StaffDepartment: DepartmentCodes} : {}),
          ...((CategoryCodes || []).length > 0 ? {StaffCategory: CategoryCodes} : {}),
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

    const staffJobPositions = await SynStaffJobPositionService.getAll({
      where: JSON.stringify({
        JobPositionsSeq: { [OP_NOT]: null },
        ID: staffs.map(staff => staff.StaffID),
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
                EndDate: { [OP_GTE]: moment().format(`YYYY-MM-DD HH:mm:ss`) }
              }
            ]
          }
        ]
      }),
      include: "SynJobPosition,OverrideReportsToJobPosition",
      perPage: 99999
    });

    if ((staffJobPositions.data || []).length <= 0) {
      return originOb;
    }

    const communitySkills = await SynCommunitySkillService.getAll({
      where: JSON.stringify({
        ID: staffs.map(staff => staff.StaffID),
      }),
      perPage: 99999
    });

    return {
      ...originOb,
      // ...((SkillCodes || []).length > 0 ? {staffs: staffs.filter(staff => ().indexOf(staff.StaffID) >= 0)} : {}),
      staffJobPositions: staffJobPositions.data || [],
      communitySkills: communitySkills.data || []
    };
  };

  useEffect(() => {
    if (Object.keys(searchCriteria).length <= 0 ) { return }
    let isCanceled = false;
    setIsLoading(true);

    doSearch(searchCriteria)
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const { luSkills, staffs, staffJobPositions, communitySkills } = resp;
        setStaffList(staffs);
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
        const sSkillMap = communitySkills.reduce((map, communitySkill) => {
          const key = communitySkill.ID;
          return {
            ...map,
            // @ts-ignore
            [key]: [...(key in map ? map[key] : []), communitySkill]
          };
        }, {});
        const columns = StaffListHelper.getListColumns({
          luSkills,
          jobPosMap: sJobPosMap,
          skillMap: sSkillMap
        });
        setColumns(columns);
        setSelectedColumns(columns.filter(column => column.isDefault === true));
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
        <FlexContainer className={'justify-content-between'}>
          <h5>{staffList?.length || 0} Staff</h5>
          <ColumnPopupSelector columns={columns} size={'sm'} onColumnSelected={(cols) => setSelectedColumns(cols)}/>
        </FlexContainer>
        <Table columns={selectedColumns} rows={staffList || []} striped />
      </>
    )
  }

  return (
    <Wrapper>
      {showSearchPanel === true ? (
        <StaffListSearchPanel
          isSearching={isLoading}
          onReset={() => {
            setStaffList(null);
            setSearchCriteria({})
          }}
          onSearch={criteria => setSearchCriteria(criteria)}
          selectedSearchCriteria={searchCriteria || undefined}
        />
      ) : null}
      <SectionDiv>
        {getContent()}
      </SectionDiv>
    </Wrapper>
  );
};

export default StaffListPanel;
