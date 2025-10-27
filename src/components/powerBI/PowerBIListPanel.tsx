import styled from "styled-components";
import iPowerBIReport from "../../types/PowerBI/iPowerBIReport";
import PowerBIService from "../../services/PowerBIService";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { iTableColumn } from "../common/Table";
import PowerBIListItemCreateOrEditPopupBtn from "./PowerBIListItemCreateOrEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import DeleteConfirmPopupBtn from "../common/DeleteConfirm/DeleteConfirmPopupBtn";
import { Button } from "react-bootstrap";
import UtilsService from "../../services/UtilsService";
import { URL_POWER_BI_DISPLAY } from "../../Url";
import useListCrudHook from "../hooks/useListCrudHook/useListCrudHook";
import {useCallback} from 'react';

const Wrapper = styled.div`
  .report-items {
    .btn.btn-link {
      padding: 0px !important;
      text-align: left;
      margin: 0px !important;
    }
  }
`;

const PowerBIListPanel = () => {
  const {
    state,
    renderDataTable,
    onRefreshOnCurrentPage,
    onRefresh
  } = useListCrudHook<iPowerBIReport>({
    getFn: useCallback(config => {
      const { filter, ...props } = config || {};
      return PowerBIService.getAll({
        where: JSON.stringify({ ...filter, isActive: true }),
        include: "CreatedBy,UpdatedBy",
        ...props
      });
    }, []),
  });

  const getColumns = <T extends {}>() => [
    {
      key: "Name",
      header: "Name",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            <PowerBIListItemCreateOrEditPopupBtn
              report={data}
              variant={"link"}
              size={"sm"}
              onSaved={() => onRefreshOnCurrentPage()}
            >
              {data.name}
            </PowerBIListItemCreateOrEditPopupBtn>
            <div className={"ellipsis"}>
              <small>
                <i>{data.description}</i>
              </small>
            </div>
          </td>
        );
      }
    },
    {
      key: "External",
      header: "External",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            <div className={"ellipsis"}>{data.externalObj?.name || ""}</div>
            <div className={"ellipsis"}>
              <small>
                <i>{data.externalId || ""}</i>
              </small>
            </div>
          </td>
        );
      }
    },
    {
      key: "PublicAccess",
      header: "All?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAll === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "isToAllTeachers",
      header: "All Teachers?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAllTeachers === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "isToAllNonTeaching",
      header: "All Non Teaching?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAllNonTeaching === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "isToAllCasualStaff",
      header: "All Casual Staff?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAllCasualStaff === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "toAllStudents",
      header: "All Students?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAllStudents === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "isToAllParents",
      header: "All Parents?",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            {data.settings?.isToAllParents === true ? (
              <Icons.CheckSquareFill className={"text-success"} />
            ) : null}
          </td>
        );
      }
    },
    {
      key: "selectedUsers",
      header: "Selected Users",
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        const userIds = data.settings?.userIds || [];
        return (
          <td key={col.key} className={"text-center"}>
            {userIds.length > 0 ? <b>{userIds.length}</b> : null}
          </td>
        );
      }
    },
    {
      key: "Operations",
      header: (column: iTableColumn<T>) => {
        return (
          <th key={column.key} className={"text-right"}>
            <PowerBIListItemCreateOrEditPopupBtn
              variant={"success"}
              size={"sm"}
              onSaved={() => onRefreshOnCurrentPage()}
            >
              <Icons.Plus /> New
            </PowerBIListItemCreateOrEditPopupBtn>
          </th>
        );
      },
      cell: (col: iTableColumn<T>, data: iPowerBIReport) => {
        return (
          <td key={col.key} className={"text-right"}>
            <Button
              variant={"secondary"}
              size={"sm"}
              title={"View the report in mConnect"}
              target={"__BLANK"}
              href={UtilsService.getModuleUrl(
                URL_POWER_BI_DISPLAY.replace(":reportId", data.id),
                process.env.REACT_APP_PUBLIC_URL || ""
              )}
            >
              <Icons.Link45deg />
            </Button>{" "}
            <DeleteConfirmPopupBtn
              variant={"danger"}
              size={"sm"}
              title={"Delete this report"}
              deletingFn={() => PowerBIService.deactiveate(data.id)}
              deletedCallbackFn={() => onRefresh()}
            >
              <Icons.Trash />
            </DeleteConfirmPopupBtn>
          </td>
        );
      }
    }
  ];

  if (state.isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      {renderDataTable({
        striped: true,
        hover: true,
        className: "report-items",
        columns: getColumns<iPowerBIReport>()
      })}
    </Wrapper>
  );
};

export default PowerBIListPanel;
