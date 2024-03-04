import styled from "styled-components";
import { useEffect, useState } from "react";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iCampusDisplayLocation from "../../../types/CampusDisplay/iCampusDisplayLocation";
import Toaster, {TOAST_TYPE_SUCCESS} from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Table, { iTableColumn } from "../../common/Table";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../helper/MathHelper";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import moment from "moment-timezone";
import CampusDisplayLocationService from "../../../services/CampusDisplay/CampusDisplayLocationService";
import UserAndDateTimePanel from "../../common/UserAndDateTimePanel";
import iCampusDisplay from '../../../types/CampusDisplay/iCampusDisplay';
import CampusDisplayLocationEditPopupBtn from './CampusDisplayLocationEditPopupBtn';

const Wrapper = styled.div``;
const CampusDisplayLocationList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [
    displayLocationList,
    setDisplayLocationList
  ] = useState<iPaginatedResult<iCampusDisplayLocation> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({ isActive: true }),
      include: "CampusDisplay,CreatedBy,UpdatedBy",
      sort: 'createdAt:DESC',
      currentPage,
      perPage
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setDisplayLocationList(resp);
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
  }, [currentPage, count, perPage]);

  const getColumns = (): iTableColumn[] => {
    return [
      {
        key: "location",
        header: "Location",
        cell: (column: iTableColumn, data: iCampusDisplayLocation) => {
          return (
            <td key={column.key}>
              <CampusDisplayLocationEditPopupBtn
                variant={"secondary"}
                campusDisplayLocation={data}
                size={"sm"}
                onSaved={() => setCount(MathHelper.add(count, 1))}
              >
                {data.name}
              </CampusDisplayLocationEditPopupBtn>
            </td>
          );
        }
      },
      {
        key: "playList",
        header: "Playing List",
        cell: (column: iTableColumn, data: iCampusDisplayLocation) => {
          return <td key={column.key}>{data.CampusDisplay?.name || ""}</td>;
        }
      },
      {
        key: "version",
        header: "Current Version",
        cell: (column: iTableColumn, data: iCampusDisplayLocation) => {
          return <td key={column.key}>{data.version || "0"}</td>;
        }
      },
      {
        key: "created",
        header: "Created",
        cell: (column: iTableColumn, data: iCampusDisplay) => {
          return <td key={column.key}>
            <small>
              <UserAndDateTimePanel
                userString={`${data.CreatedBy?.firstName || ""} ${data.CreatedBy
                  ?.lastName || ""}`.trim()}
                dateTimeString={moment(data.createdAt).format('lll')}
              />
            </small>
          </td>;
        }
      },
      {
        key: "updated",
        header: "Updated",
        cell: (column: iTableColumn, data: iCampusDisplay) => {
          return <td key={column.key}>
            <small>
              <UserAndDateTimePanel
                userString={`${data.UpdatedBy?.firstName || ""} ${data.UpdatedBy
                  ?.lastName || ""}`.trim()}
                dateTimeString={moment(data.updatedAt).format('lll')}
              />
            </small>
          </td>;
        }
      },
      {
        key: "operations",
        header: (column: iTableColumn) => {
          return (
            <td key={column.key} className={"text-right"}>
              <CampusDisplayLocationEditPopupBtn
                variant={"success"}
                size={"sm"}
                onSaved={() => setCount(MathHelper.add(count, 1))}
              >
                <Icons.Plus /> New
              </CampusDisplayLocationEditPopupBtn>
            </td>
          );
        },
        cell: (column: iTableColumn, data: iCampusDisplayLocation) => {
          return (
            <td key={column.key} className={"text-right"}>
              <DeleteConfirmPopupBtn
                variant={"danger"}
                deletingFn={() =>
                  CampusDisplayLocationService.deactivate(data.id || "")
                }
                deletedCallbackFn={() => {
                  setCount(MathHelper.add(count, 1));
                  Toaster.showToast("Display Deleted.", TOAST_TYPE_SUCCESS);
                }}
                size={"sm"}
                description={
                  <>
                    You are about to delete the location <u>{data.name}</u>
                  </>
                }
                confirmString={`${user?.synergyId || "na"}`}
              >
                <Icons.Trash />
              </DeleteConfirmPopupBtn>
            </td>
          );
        }
      }
    ];
  };

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }
    return (
      <Table
        columns={getColumns()}
        rows={displayLocationList?.data || []}
        pagination={{
          totalPages: displayLocationList?.pages || 0,
          currentPage: displayLocationList?.currentPage || 0,
          onSetCurrentPage: (page: number) => setCurrentPage(page),
          perPage: displayLocationList?.perPage || 0,
          onPageSizeChanged: (pageSize: number) => setPerPage(pageSize)
        }}
        responsive
        hover
        striped
      />
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CampusDisplayLocationList;
