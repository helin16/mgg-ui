import styled from "styled-components";
import { useEffect, useState } from "react";
import iPaginatedResult from "../../types/iPaginatedResult";
import iPowerBIReport from "../../types/PowerBI/iPowerBIReport";
import PowerBIService from "../../services/PowerBIService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import Table, { iTableColumn } from "../common/Table";
import moment from "moment-timezone";
import PowerBIListItemCreateOrEditPopupBtn from "./PowerBIListItemCreateOrEditPopupBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../helper/MathHelper";
import DeleteConfirmPopupBtn from "../common/DeleteConfirm/DeleteConfirmPopupBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import {Button} from 'react-bootstrap';
import UtilsService from '../../services/UtilsService';
import {URL_POWER_BI_DISPLAY} from '../../Url';

const Wrapper = styled.div``;

const PowerBIListPanel = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [reportList, setReportList] = useState<iPaginatedResult<
    iPowerBIReport
  > | null>(null);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    PowerBIService.getAll({
      where: JSON.stringify({ isActive: true }),
      include: "CreatedBy,UpdatedBy"
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setReportList(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showToast(err);
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
  }, [count]);

  const getColumns = () => [
    {
      key: "Name",
      header: "Name",
      cell: (col: iTableColumn, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            <PowerBIListItemCreateOrEditPopupBtn
              report={data}
              variant={"link"}
              size={"sm"}
              onSaved={() => {
                setCount(MathHelper.add(count, 1));
              }}
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
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
      cell: (col: iTableColumn, data: iPowerBIReport) => {
        const userIds = data.settings?.userIds || [];
        return (
          <td key={col.key} className={"text-center"}>
            {userIds.length > 0 ? <b>{userIds.length}</b> : null}
          </td>
        );
      }
    },
    {
      key: "CreatedBy",
      header: "CreatedBy",
      cell: (col: iTableColumn, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            <div>
              <b>By</b> {data.CreatedBy?.firstName || ""}{" "}
              {data.CreatedBy?.lastName || ""}
            </div>
            <div>
              <b>@</b> {moment(data.createdAt).format("lll")}
            </div>
          </td>
        );
      }
    },
    {
      key: "UpdatedBy",
      header: "UpdatedBy",
      cell: (col: iTableColumn, data: iPowerBIReport) => {
        return (
          <td key={col.key}>
            <div>
              <b>By</b> {data.UpdatedBy?.firstName || ""}{" "}
              {data.UpdatedBy?.lastName || ""}
            </div>
            <div>
              <b>@</b> {moment(data.updatedAt).format("lll")}
            </div>
          </td>
        );
      }
    },
    {
      key: "Operations",
      header: (column: iTableColumn) => {
        return (
          <th key={column.key} className={"text-right"}>
            <PowerBIListItemCreateOrEditPopupBtn
              variant={"success"}
              size={"sm"}
              onSaved={() => {
                setCount(MathHelper.add(count, 1))
              }}
            >
              <Icons.Plus /> New
            </PowerBIListItemCreateOrEditPopupBtn>
          </th>
        );
      },
      cell: (col: iTableColumn, data: iPowerBIReport) => {
        return (
          <td key={col.key} className={"text-right"}>
            <Button
              variant={"secondary"}
              size={"sm"}
              title={'View the report in mConnect'}
              target={'__BLANK'}
              href={UtilsService.getModuleUrl(URL_POWER_BI_DISPLAY.replace(':reportId', data.id), process.env.REACT_APP_URL || '')}
            >
              <Icons.Link45deg />
            </Button>
            {' '}
            <DeleteConfirmPopupBtn
              variant={"danger"}
              size={"sm"}
              title={'Delete this report'}
              deletingFn={() => PowerBIService.deactiveate(data.id)}
              deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
              confirmString={`${currentUser?.synergyId || "na"}`}
            >
              <Icons.Trash />
            </DeleteConfirmPopupBtn>
          </td>
        );
      }
    }
  ];

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Table
        striped
        hover
        columns={getColumns()}
        rows={reportList?.data || []}
      />
    </Wrapper>
  );
};

export default PowerBIListPanel;
