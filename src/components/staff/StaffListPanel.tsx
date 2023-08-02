import styled from "styled-components";
import { useEffect, useState } from "react";
import iVStaff from "../../types/Synergetic/iVStaff";
import SynVStaffService from "../../services/Synergetic/SynVStaffService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import Table, { iTableColumn } from "../common/Table";
import StaffListHelper, {iJobPositionMap} from "./StaffListHelper";
import SynStaffJobPositionService from "../../services/Synergetic/Staff/SynStaffJobPositionService";
import {
  OP_AND,
  OP_GTE,
  OP_LTE,
  OP_NOT,
  OP_OR
} from "../../helper/ServiceHelper";
import moment from "moment-timezone";

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

const StaffListPanel = () => {
  const [staffList, setStaffList] = useState<iVStaff[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn[]>([]);
  const [staffJobPosMap, setStaffJobPosMap] = useState<iJobPositionMap>({});
  const [searchCriteria, ] = useState<{ [key: string]: any }>({
    ActiveFlag: true
  });

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynVStaffService.getStaffList({
        where: JSON.stringify(searchCriteria)
      }),
      SynStaffJobPositionService.getAll({
        where: JSON.stringify({
          JobPositionsSeq: { [OP_NOT]: null },
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
        include: 'SynJobPosition,OverrideReportsToJobPosition',
        perPage: 99999
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setStaffList(resp[0]);
        const sJobPosMap = (resp[1].data || []).reduce((map, staffJobPos) => {
          const key = staffJobPos.ID;
          return {
            ...map,
            // @ts-ignore
            [key]: [...(key in map ? map[key] : []), staffJobPos],
          }
        }, {});
        setStaffJobPosMap(sJobPosMap)
        setSelectedColumns(StaffListHelper.getListColumns(sJobPosMap).filter(column => column.isDefault === true))
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
  }, [searchCriteria]);

  console.log('staffJobPosMap', staffJobPosMap);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Table columns={selectedColumns} rows={staffList || []} striped />
    </Wrapper>
  );
};

export default StaffListPanel;
