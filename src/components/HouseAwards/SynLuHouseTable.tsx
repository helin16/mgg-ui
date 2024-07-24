import { iTableColumn } from "../common/Table";
import iSynLuHouse from "../../types/Synergetic/Lookup/iSynLuHouse";
import SynLuHouseService from "../../services/Synergetic/Lookup/SynLuHouseService";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { OP_GT } from "../../helper/ServiceHelper";
import useListCrudHook from "../hooks/useListCrudHook/useListCrudHook";
import AppService from "../../services/AppService";
import {useCallback} from 'react';

type iSynLuHouseTable = {
  className?: string;
};
const SynLuHouseTable = ({ className }: iSynLuHouseTable) => {
  const { state, renderDataTable } = useListCrudHook<iSynLuHouse>({
    perPage: 99999,
    getFn: useCallback(config => {
      const { filter, sort, ...props } = config || {};
      return SynLuHouseService.getLuHouses({
        where: JSON.stringify({
          ...filter,
          ActiveFlag: true,
          HeadOfHouseID: { [OP_GT]: 0 }
        }),
        sort: sort || "SortOrder:ASC",
        ...props
      }).then(res => AppService.convertArrToPaginatedArr<iSynLuHouse>(res));
    }, []),
  });

  if (state.isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return renderDataTable({
    className,
    responsive: true,
    hover: true,
    striped: true,
    columns: [
      {
        key: "Campus",
        header: "Campus",
        cell: (col: iTableColumn<iSynLuHouse>, data: iSynLuHouse) => {
          return <td key={col.key}>{data.Campus}</td>;
        }
      },
      {
        key: "code",
        header: "Code",
        cell: (col: iTableColumn<iSynLuHouse>, data: iSynLuHouse) => {
          return <td key={col.key}>{data.Code}</td>;
        }
      },
      {
        key: "description",
        header: "Description",
        cell: (col: iTableColumn<iSynLuHouse>, data: iSynLuHouse) => {
          return <td key={col.key}>{data.Description}</td>;
        }
      },
      {
        key: "headOfHouse",
        header: "Head of House",
        cell: (col: iTableColumn<iSynLuHouse>, data: iSynLuHouse) => {
          return <td key={col.key}>{data.HeadOfHouse}</td>;
        }
      },
      {
        key: "headOfHouseId",
        header: "Head of House ID",
        cell: (col: iTableColumn<iSynLuHouse>, data: iSynLuHouse) => {
          return <td key={col.key}>{data.HeadOfHouseID}</td>;
        }
      }
    ]
  });
};

export default SynLuHouseTable;
